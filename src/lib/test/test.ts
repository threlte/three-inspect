import MagicString from 'magic-string'
import { parse, walk } from 'svelte/compiler'

const start = async () => {
	const testComponent = Bun.file('Test.svelte')
	const text = (await testComponent.text()) as string

	const ast = parse(text)

	const comp = new MagicString(text)

	const i = 0

	Bun.write('AST.json', JSON.stringify(ast, null, 2))

	/**
	 * updates a node's value
	 */
	// walk(ast.html, {
	// 	enter(node, parent, key, index) {
	// 		if (node.type === 'InlineComponent' && node.name === 'T.Mesh') {
	// 			// search for the attribute "position"
	// 			const position = node.attributes.find(
	// 				(attr) => attr.name === 'position' && attr.type === 'Attribute'
	// 			)
	// 			if (!position) return
	// 			// get the mustache tag value
	// 			const value = position.value[0]
	// 			if (value.type !== 'MustacheTag') return
	// 			// write new value of [0, 100, 0]
	// 			comp.update(value.expression.start, value.expression.end, '[0, 100, 0]')
	// 		}
	// 	},
	// })

	interface Property {
		name: string
		start: number
		end: number
		value: {
			start: number
			end: number
			value: any
			error?: any
		}
	}

	interface HierarchyNode {
		name: string
		start?: number
		end?: number
		module?: string
		properties?: Property[]
		children?: HierarchyNode[]
	}

	const hierarchy: HierarchyNode = {
		name: 'root',
		children: [],
	}

	const isTComponent = (node: any) => {
		return node.name?.startsWith('T.') && node.type === 'InlineComponent'
	}

	const getModule = (node: any) => {
		return node.name.replace(/^T\./, '')
	}

	const extractProperties = (node: any) => {
		const properties: Property[] = []
		node.attributes.forEach((attr: any) => {
			let value
			let valueStart
			let valueEnd
			let error
			switch (attr.value[0].type) {
				case 'MustacheTag': {
					const raw = comp.slice(attr.value[0].expression.start, attr.value[0].expression.end)
					valueStart = attr.value[0].expression.start
					valueEnd = attr.value[0].expression.end
					try {
						const parsed = JSON.parse(raw)
						value = parsed
					} catch {
						value = raw
						error = 'invalid-property'
					}
					break
				}
				case 'Text': {
					value = attr.value[0].data
					valueStart = attr.value[0].start
					valueEnd = attr.value[0].end
					break
				}
				default: {
					return
				}
			}
			properties.push({
				name: attr.name,
				start: attr.start,
				end: attr.end,
				value: {
					start: valueStart,
					end: valueEnd,
					value,
					error,
				},
			})
		})
		return properties
	}

	const buildHierarchy = (node: any, parent: HierarchyNode) => {
		// base case
		if (!node.children || node.children.length === 0) {
			if (!isTComponent(node)) return
			parent.children.push({
				name: node.name,
				start: node.start,
				end: node.end,
				module: getModule(node),
				properties: extractProperties(node),
			})
			return
		}

		// pre
		let hierarchyNode = parent
		if (isTComponent(node)) {
			hierarchyNode = {
				name: node.name,
				start: node.start,
				end: node.end,
				module: getModule(node),
				properties: extractProperties(node),
				children: [],
			}
			parent.children.push(hierarchyNode)
		}

		// recurse
		for (const child of node.children) {
			buildHierarchy(child, hierarchyNode)
		}
	}

	buildHierarchy(ast.html, hierarchy)

	Bun.write('Hierarchy.json', JSON.stringify(hierarchy, null, 2))
	Bun.write('Test.svelte', comp.toString())
}

start()
