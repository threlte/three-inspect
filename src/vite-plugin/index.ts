import MagicString from 'magic-string'
import { readFileSync, writeFileSync } from 'node:fs'
import { parse, walk } from 'svelte/compiler'
import type { Plugin } from 'vite'
import type { Transaction } from '../lib/internal/context'

const dummyScript = '<script>"ABC"</script>'
const dummyStyle = '<style>"ABC"</style>'
const precision = 4

const extractMarkup = (code: string) => {
	// to parse the markup, we first need to remove the script and the style blocks
	const scriptRegex = /<script[^>]*>[\S\s]*?<\/script>/u
	const styleRegex = /<style[^>]*>[\S\s]*?<\/style>/u
	const scriptMatch = code.match(scriptRegex)
	const styleMatch = code.match(styleRegex)
	const hasScript = Boolean(scriptMatch)
	const hasStyle = Boolean(styleMatch)

	let markup = code

	if (hasScript) {
		markup = markup.replace(scriptRegex, dummyScript)
	}
	if (hasStyle) {
		markup = markup.replace(styleRegex, dummyStyle)
	}

	return {
		markup,
		script: hasScript ? scriptMatch![0] : undefined,
		style: hasStyle ? styleMatch![0] : undefined,
	}
}

const buildComponent = (markup: string, script: string | undefined, style: string | undefined) => {
	let component = markup
	if (script) {
		component = component.replace(dummyScript, script)
	}
	if (style) {
		component = component.replace(dummyStyle, style)
	}
	return component
}

const transformMarkup = (markup: string, id: string): string => {
	const mc = new MagicString(markup)
	const ast = parse(markup)
	let index = 0
	walk(ast.html, {
		enter(node, parent, key) {
			if (node.type === 'InlineComponent' && node.name.startsWith('T.')) {
				const nodeNameLen = node.name.length + 1 // account for "<"
				const str = ` inspectorOptions={{ id: '${id}', start: ${node.start}, index: ${index} }}`
				index++
				mc.appendLeft(node.start + nodeNameLen, str)
			}
		},
	})
	return mc.toString()
}

const toFixedWithoutZeros = (num: number) => `${Number.parseFloat(num.toFixed(precision))}`

const parseValue = (value: unknown): string => {
	if (Array.isArray(value)) {
		return `[${value.map((element) => parseValue(element)).join(', ')}]`
	}
	if (typeof value === 'string') {
		return `'${value}'`
	}
	if (typeof value === 'number') {
		return toFixedWithoutZeros(value)
	}
	if (typeof value === 'boolean') {
		return value.toString()
	}
	if (value === undefined) {
		return 'undefined'
	}
	if (value === null) {
		return 'null'
	}
	if (typeof value === 'object') {
		return `{${Object.entries(value)
			.map(([key, v]) => `${key}: ${parseValue(v)}`)
			.join(', ')}}`
	}
	return JSON.stringify(value)
}

const changeAttribute = (
	componentContent: string,
	componentIndex: number,
	attribute: string,
	value: unknown
) => {
	const { markup, script, style } = extractMarkup(componentContent)

	// alter markup
	const mc = new MagicString(markup)
	const ast = parse(markup)
	let index = -1

	walk(ast.html, {
		enter(node, parent, key) {
			if (node.type !== 'InlineComponent' || !node.name.startsWith('T.')) return
			index++

			if (index !== componentIndex) return

			// search for the attribute
			const attr = node.attributes.find(
				(attr) => attr.name === attribute && attr.type === 'Attribute'
			)

			if (!attr) {
				// check if the tag is multiline
				let isMultiLine = false
				let indent = ' '
				if (node.attributes?.length) {
					// const end = node.attributes[node.attributes.length - 1].end
					// // find new line chars in between
					// isMultiLine = markup.slice(node.start, end).includes('\n')
					const firstAttribute = node.attributes[0]
					const startOfFirstAttribute = firstAttribute.start
					const endOfTagOpen = node.start + node.name.length + 1 // +1 for "<"
					const slice = markup.slice(endOfTagOpen, startOfFirstAttribute)
					isMultiLine = slice.includes('\n')
					indent = slice
				}
				if (isMultiLine) {
					mc.appendLeft(
						node.start + node.name.length + 1,
						`${indent}${attribute}={${parseValue(value)}}`
					)
				} else {
					mc.appendLeft(node.start + node.name.length + 1, ` ${attribute}={${parseValue(value)}}`)
				}
			} else {
				// get the mustache tag value
				const attributeValue = attr.value
				if (typeof attributeValue === 'boolean') {
					// shorthand boolean attribute like "disabled"
					// add the attribute with the value
					mc.appendLeft(attr.end, `={${parseValue(value)}}`)
				} else if (Array.isArray(attributeValue)) {
					if (attributeValue[0].type !== 'MustacheTag') return
					// write new value of [0, 100, 0]
					mc.update(
						attributeValue[0].expression.start,
						attributeValue[0].expression.end,
						parseValue(value)
					)
				}
			}
		},
	})

	const finalComponent = buildComponent(mc.toString(), script, style)

	return finalComponent
}

const transactions: Transaction[] = []
const noHMROnIds = new Set<string>()
const fileTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

export const plugin: () => Plugin = () => {
	return {
		name: 'Threlte-Inspector',
		enforce: 'pre',
		transform(code, id, options) {
			if (!id.endsWith('.svelte')) return {}
			if (!code.includes('<T.')) return {}

			const { markup, script, style } = extractMarkup(code)

			let transformedMarkup = transformMarkup(markup, id)

			transformedMarkup = buildComponent(transformedMarkup, script, style)

			return {
				code: transformedMarkup,
			}
		},
		handleHotUpdate({ modules }) {
			for (const module of modules) {
				if (module.id?.endsWith('.svelte') && noHMROnIds.has(module.id)) return []
			}
			return undefined
		},

		configureServer(server) {
			server.ws.on('threlte-inspector:from-client', (data, client) => {
				const d = data as {
					id: string
					transactions: Transaction[]
				}

				transactions.push(...d.transactions)

				const transactionsPerFileId: Record<string, Transaction[]> = {}

				for (const t of transactions) {
					if (t.fileId in transactionsPerFileId) {
						transactionsPerFileId[t.fileId].push(t)
					} else {
						transactionsPerFileId[t.fileId] = [t]
					}
				}

				Object.keys(transactionsPerFileId).forEach((fileId) => {
					noHMROnIds.add(fileId)
					if (fileTimeouts.has(fileId)) {
						clearTimeout(fileTimeouts.get(fileId))
					}
					let component = readFileSync(fileId, 'utf8')
					for (const t of transactionsPerFileId[fileId]) {
						component = changeAttribute(
							component,
							t.componentIndex,
							t.attributeName,
							t.attributeValue
						)
					}
					writeFileSync(fileId, component)
					fileTimeouts.set(
						fileId,
						setTimeout(() => {
							noHMROnIds.delete(fileId)
							fileTimeouts.delete(fileId)
						}, 1000)
					)
				})

				server.ws.send(`threlte-inspector:from-server-${d.id}`, {
					success: true,
				})
			})
		},
	}
}
