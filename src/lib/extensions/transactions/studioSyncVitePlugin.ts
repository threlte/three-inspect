import type { Plugin } from 'vite'
import { createRPCServer } from 'vite-dev-rpc'
import type { ClientFunctions, ServerFunctions } from './types'
import {
	addStudioRuntimeProps,
	componentNeedsTransform,
	isPrepared,
	prepareMarkup,
	removeAttribute,
	upsertAttribute,
} from './utils/component'
import { assembleComponent, disassembleComponent } from './utils/componentUtils'
import { readComponent, writeComponent } from './utils/fileUtils'
import { toMagicString } from './utils/utils'
import { parsers } from './utils/parsers'

const HmrIgnoredModuleIds = new Set<string>()

export const plugin: () => Plugin = () => {
	return {
		name: 'Threlte-Inspector',
		enforce: 'pre',
		transform(code, id) {
			if (!id.endsWith('.svelte')) return
			if (!componentNeedsTransform(code)) return
			const { markup, script, scriptModule, style } = disassembleComponent(code)
			const magicMarkup = toMagicString(markup)
			addStudioRuntimeProps(magicMarkup, id)
			const finalComponent = assembleComponent(magicMarkup, script, scriptModule, style)
			return {
				code: finalComponent,
			}
		},
		handleHotUpdate({ file }) {
			if (HmrIgnoredModuleIds.has(file)) {
				HmrIgnoredModuleIds.delete(file)
				return []
			}
		},
		configureServer(server) {
			createRPCServer<ClientFunctions, ServerFunctions>('threlte-studio', server.ws, {
				isPrepared(moduleId) {
					// const code = readComponent(moduleId)
					// const { markup } = disassembleComponent(code)
					// return isPrepared(markup)
				},
				prepare(moduleId) {
					// const component = readComponent(moduleId)
					// if (!componentNeedsTransform(component)) return
					// const { markup, script, scriptModule, style } = disassembleComponent(component)
					// if (isPrepared(markup)) return
					// const magicMarkup = toMagicString(markup)
					// const { isModified } = prepareMarkup(magicMarkup)
					// if (!isModified) return
					// const diskComponent = assembleComponent(magicMarkup, script, scriptModule, style)
					// writeComponent(moduleId, diskComponent)
				},
				transaction({ componentName, transactionId, moduleId, attributeName, to, parserType }) {
					// console.log(
					// 	'transaction',
					// 	componentName,
					// 	transactionId,
					// 	moduleId,
					// 	attributeName,
					// 	to,
					// 	parserType,
					// )
					// const component = readComponent(moduleId)
					// const { markup, script, scriptModule, style } = disassembleComponent(component)
					// const magicMarkup = toMagicString(markup)
					// const parser = parsers[parserType]
					// if (parser.isDefaultValue?.(to)) {
					// 	removeAttribute(magicMarkup, componentName, attributeName)
					// } else {
					// 	upsertAttribute(magicMarkup, componentName, attributeName, to, parser, 'last')
					// }
					// const diskComponent = assembleComponent(magicMarkup, script, scriptModule, style)
					// HmrIgnoredModuleIds.add(moduleId)
					// writeComponent(moduleId, diskComponent)
					// return { transactionId, success: true }
				},
			})
		},
	}
}
