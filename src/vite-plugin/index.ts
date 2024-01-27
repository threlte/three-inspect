import MagicString from 'magic-string'
import { readFileSync, writeFileSync } from 'node:fs'
import { parse, walk } from 'svelte/compiler'
import type { Plugin } from 'vite'
import type { Transaction } from '../lib/internal/context'

const dummyScript = '<script>"ABC"</script>'
const dummyScriptModule = '<script context="module">"ABC"</script>'
const dummyStyle = '<style>"ABC"</style>'
const precision = 4

const extractMarkup = (code: string) => {
	// to parse the markup, we first need to remove the script and the style blocks
	const scriptRegex = /<script(?![^>]*context="module")[^>]*>[\s\S]*?<\/script>/gu
	const scriptModuleRegex = /<script[^>]*context="module"[^>]*>[\S\s]*?<\/script>/gu
	const styleRegex = /<style[^>]*>[\S\s]*?<\/style>/gu
	const scriptMatch = code.match(scriptRegex)
	const scriptModuleMatch = code.match(scriptModuleRegex)
	const styleMatch = code.match(styleRegex)
	const hasScript = Boolean(scriptMatch)
	const hasScriptModule = Boolean(scriptModuleMatch)
	const hasStyle = Boolean(styleMatch)

	let markup = code

	if (hasScriptModule) {
		markup = markup.replaceAll(scriptModuleRegex, dummyScriptModule)
	}
	if (hasScript) {
		markup = markup.replaceAll(scriptRegex, dummyScript)
	}
	if (hasStyle) {
		markup = markup.replaceAll(styleRegex, dummyStyle)
	}

	return {
		markup,
		scriptModule: hasScriptModule ? scriptModuleMatch![0] : undefined,
		script: hasScript ? scriptMatch![0] : undefined,
		style: hasStyle ? styleMatch![0] : undefined,
	}
}

const buildComponent = (
	markup: string,
	script: string | undefined,
	scriptModule: string | undefined,
	style: string | undefined
) => {
	let component = markup
	if (scriptModule) {
		component = component.replace(dummyScriptModule, scriptModule)
	}
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
			if ((node.type === 'InlineComponent' && node.name.startsWith('T.')) || node.name === 'T') {
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
	value: unknown,
	path?: string[]
) => {
	const { markup, script, scriptModule, style } = extractMarkup(componentContent)

	// alter markup
	const mc = new MagicString(markup)
	const ast = parse(markup)
	let index = -1

	const finalPathItems = path ?? []
	finalPathItems.push(attribute)
	const finalPath = finalPathItems.join('.')

	walk(ast.html, {
		enter(node, parent, key) {
			if (node.type !== 'InlineComponent') return
			if (node.name !== 'T' && !node.name.startsWith('T.')) return
			index++

			if (index !== componentIndex) return

			// search for the attribute
			const attr = node.attributes.find(
				(attr) => attr.name === finalPath && attr.type === 'Attribute'
			)

			if (!attr) {
				// check if the tag is multiline
				let isMultiLine = false
				let indent = ' '
				if (node.attributes?.length) {
					// find new line chars in between
					const firstAttribute = node.attributes[0]
					const startOfFirstAttribute = firstAttribute.start
					const endOfTagOpen = node.start + node.name.length + 1 // +1 for "<"
					const slice = markup.slice(endOfTagOpen, startOfFirstAttribute)
					isMultiLine = slice.includes('\n')
					indent = slice
				}
				// new attributes should be added after the last attribute
				let start = node.start + node.name.length + 1
				const hasAttributes = Boolean(node.attributes?.length)
				if (hasAttributes) {
					start = node.attributes[node.attributes.length - 1].end
				}
				if (isMultiLine) {
					mc.appendLeft(start, `${indent}${finalPath}={${parseValue(value)}}`)
				} else {
					mc.appendLeft(start, ` ${finalPath}={${parseValue(value)}}`)
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

	const finalComponent = buildComponent(mc.toString(), script, scriptModule, style)

	return finalComponent
}

const noHMROnIds = new Set<string>()
const fileTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

export const plugin: () => Plugin = () => {
	return {
		name: 'Threlte-Inspector',
		enforce: 'pre',
		transform(code, id, options) {
			if (!id.endsWith('.svelte')) return {}
			if (!code.includes('<T.') && !code.includes('<T ') && !code.includes('<T\n')) return {}

			const { markup, script, style, scriptModule } = extractMarkup(code)

			let transformedMarkup = transformMarkup(markup, id)

			transformedMarkup = buildComponent(transformedMarkup, script, scriptModule, style)

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

				const transactionsPerFileId: Record<string, Transaction[]> = {}

				for (const t of d.transactions) {
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
							t.attributeValue,
							t.path
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
