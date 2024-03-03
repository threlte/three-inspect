import type { Node } from 'estree'
import MagicString from 'magic-string'
import { readFileSync, writeFileSync } from 'node:fs'
import { parse, walk } from 'svelte/compiler'
import { defaultParser } from './parsers'

const dummyScript = '<script>"ABC"</script>'
const dummyScriptModule = '<script context="module">"ABC"</script>'
const dummyStyle = '<style></style>'

export const disassembleComponent = (component: MagicString) => {
	const code = component.toString()
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
		markup: new MagicString(markup),
		scriptModule: hasScriptModule ? scriptModuleMatch![0] : undefined,
		script: hasScript ? scriptMatch![0] : undefined,
		style: hasStyle ? styleMatch![0] : undefined,
	}
}

const isMagicString = (object: unknown): object is MagicString => {
	return object instanceof MagicString
}

export const assembleComponent = (
	markup: MagicString,
	script: string | undefined,
	scriptModule: string | undefined,
	style: string | undefined,
) => {
	let component = isMagicString(markup) ? markup.toString() : markup
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

export const componentFromCode = (code: string): MagicString => {
	return new MagicString(code)
}

export const readComponent = (path: string): MagicString => {
	const componentContent = readFileSync(path, {
		encoding: 'utf8',
	})
	return new MagicString(componentContent)
}

export const writeComponent = (path: string, component: string) => {
	writeFileSync(path, component, {
		encoding: 'utf8',
	})
}

export const componentNeedsTransform = (markup: string | MagicString): boolean => {
	const markupString = isMagicString(markup) ? markup.toString() : markup
	return (
		markupString.includes('<T.') || markupString.includes('<T ') || markupString.includes('<T\n')
	)
}

type BaseAttributeValue = {
	start: number
	end: number
}

type TextAttributeValue = {
	type: 'Text'
	raw: string
	data: string
}

type MustacheTagAttributeValue = {
	type: 'MustacheTag'
	expression: {
		type: 'Literal'
		start: number
		end: number
		loc: {
			start: {
				line: number
				column: number
			}
			end: {
				line: number
				column: number
			}
		}
		value: unknown
		raw: unknown
	}
}

type AttributeValue = BaseAttributeValue & (TextAttributeValue | MustacheTagAttributeValue)

type Attribute = {
	name: string
	start: number
	end: number
	type: 'Attribute'
	value: AttributeValue[]
}

type DefinedNode = Node & {
	name: string
	start: number
	end: number
} & {
	attributes: Attribute[]
}

const isDefinedNode = (node: unknown): node is DefinedNode => {
	return (
		typeof node === 'object' &&
		node !== null &&
		'attributes' in node &&
		Array.isArray(node.attributes) &&
		'name' in node &&
		'start' in node &&
		'end' in node
	)
}

const hasName = (node: DefinedNode, name: string): boolean => {
	const nameAttribute = node.attributes.find((attr) => attr.name === 'name')
	if (!nameAttribute) return false
	const value =
		nameAttribute.value[0].type === 'Text'
			? nameAttribute.value[0].data
			: nameAttribute.value[0].expression.value
	return value === name
}

const isMultiLineNode = (
	markup: MagicString,
	node: DefinedNode,
): { isMultiLine: boolean; indent: string } => {
	let isMultiLine = false
	let indent = ''
	if (node.attributes.length > 0) {
		// find new line chars in between
		const firstAttribute = node.attributes[0]
		const startOfFirstAttribute = firstAttribute.start
		// +1 for "<"
		const endOfTagOpen = node.start + node.name.length + 1
		const slice = markup.slice(endOfTagOpen, startOfFirstAttribute)
		isMultiLine = slice.includes('\n')
		indent = slice
	}
	return {
		isMultiLine,
		indent,
	}
}

const findNode = (markup: MagicString, componentName: string): DefinedNode | undefined => {
	const ast = parse(markup.toString())
	let finalNode: DefinedNode | undefined
	walk(ast.html as Node, {
		enter(node) {
			const type = node.type as string
			if (!isDefinedNode(node)) return
			if (type !== 'InlineComponent') return
			if (!node.name.startsWith('T.') && node.name !== 'T') return
			if (!hasName(node, componentName)) return
			finalNode = node
		},
	})
	return finalNode
}

/**
 * Upserts an attribute to a `<T>` component.
 */
export const upsertAttribute = (
	markup: MagicString,
	componentNameOrNode: string | DefinedNode,
	attributeName: string,
	value: string,
	position: 'first' | 'last',
) => {
	const node =
		typeof componentNameOrNode === 'string'
			? findNode(markup, componentNameOrNode)
			: componentNameOrNode

	if (!node) {
		throw new Error('Node not found')
	}

	const attribute = node.attributes.find((attr) => attr.name === attributeName)

	if (attribute) {
		// update
		const attributeValue = attribute.value[0]
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (attributeValue.type === 'Text') {
			// text
			markup.overwrite(attributeValue.start, attributeValue.end, value)
		} else {
			// mustache tag
			markup.overwrite(attributeValue.expression.start, attributeValue.expression.end, value)
		}
		markup.overwrite(attributeValue.start, attributeValue.end, value)
	} else {
		// insert
		const { isMultiLine, indent } = isMultiLineNode(markup, node)

		// account for `<` at start of node
		let start = node.start + node.name.length + 1
		if (node.attributes.length > 0 && position === 'last') {
			const lastAttribute = node.attributes.at(-1)!
			start = lastAttribute.end
		}
		if (isMultiLine) {
			markup.appendLeft(start, `${indent}${attributeName}={${value}}`)
		} else {
			markup.appendLeft(start, ` ${attributeName}={${value}}`)
		}
	}
}

/**
 * Removes an attribute from a `<T>` component.
 */
export const removeAttribute = (
	markup: MagicString,
	componentNameOrNode: string | DefinedNode,
	attributeName: string,
): void => {
	const node =
		typeof componentNameOrNode === 'string'
			? findNode(markup, componentNameOrNode)
			: componentNameOrNode

	if (!node) {
		throw new Error('Node not found')
	}

	const attribute = node.attributes.find((attr) => attr.name === attributeName)
	if (!attribute) return

	markup.remove(attribute.start, attribute.end)
}

// type InsertComponentOptions = {
// 	class: string
// } & (
// 	| {
// 			beforeComponentName: string
// 	  }
// 	| {
// 			afterComponentName: string
// 	  }
// )

/**
 * Inserts a new component before or after another component
 */
// export const insertComponent = (
// 	markup: MagicString,
// 	options: InsertComponentOptions,
// ): MagicString => {}

const createShortRandomId = () => {
	return Math.random().toString(36).slice(2, 5)
}

/**
 * Prepares a component to be used with the Threlte Studio.
 * - Adds name properties to `<T>` components
 */
export const prepareMarkup = (
	markup: MagicString,
): {
	isModified: boolean
} => {
	const ast = parse(markup.toString())
	let isModified = false
	walk(ast.html as Node, {
		enter(node) {
			const type = node.type as string
			if (!isDefinedNode(node)) return
			if ((type === 'InlineComponent' && node.name.startsWith('T.')) || node.name === 'T') {
				// - read attributes and check if `name` attribute exists
				if (node.attributes.some((attr) => attr.name === 'name')) return
				// - if not, add it
				const name = `studio_${createShortRandomId()}`
				isModified = true
				upsertAttribute(markup, node, 'name', name, 'first')
			}
		},
	})
	return {
		isModified,
	}
}

export const addStudioRuntimeProps = (markup: MagicString, id: string): void => {
	const ast = parse(markup.toString())
	walk(ast.html as Node, {
		enter(node) {
			const type = node.type as string
			if (!isDefinedNode(node)) return
			if ((type === 'InlineComponent' && node.name.startsWith('T.')) || node.name === 'T') {
				upsertAttribute(
					markup,
					node,
					'threlteStudio',
					defaultParser.stringify({ moduleId: id }),
					'last',
				)
			}
		},
	})
}
