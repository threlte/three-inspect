import type { Plugin } from 'vite'
import { createRPCServer } from 'vite-dev-rpc'
import { addStudioRuntimeProps, componentNeedsTransform } from './utils/componentParser'
import * as componentUtils from './utils/componentUtils'
import * as fileUtils from './utils/fileUtils'
import * as componentParser from './utils/componentParser'
import { toMagicString } from './utils/magicStringUtils'
import type { ClientFunctions, ServerFunctions } from '../rpc'
import { parsers } from './utils/parsers'

const HmrIgnoredModuleIds = new Set<string>()

export const plugin: () => Plugin = () => {
	return {
		name: 'Threlte-Inspector',
		enforce: 'pre',
		transform(code, id) {
			if (!id.endsWith('.svelte')) return
			if (!componentNeedsTransform(code)) return
			const { markup, script, scriptModule, style } = componentUtils.disassembleComponent(code)
			const magicMarkup = toMagicString(markup)
			addStudioRuntimeProps(magicMarkup, id)
			const finalComponent = componentUtils.assembleComponent(
				magicMarkup,
				script,
				scriptModule,
				style,
			)
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
				syncTransaction(transaction) {
					const code = fileUtils.readComponent(transaction.moduleId)
					if (!componentNeedsTransform(code)) {
						console.error('Component does not need transform')
						return
					}
					const { markup, script, scriptModule, style } = componentUtils.disassembleComponent(code)
					const magicMarkup = toMagicString(markup)
					const node = componentParser.findNodeByIndex(magicMarkup, transaction.componentIndex)
					if (!node) {
						console.error('Could not find node by index', transaction.componentIndex)
						return
					}
					componentParser.upsertAttribute(
						magicMarkup,
						node,
						transaction.attributeName,
						transaction.attributeValue,
						parsers[transaction.parserType],
						'last',
					)
					const finalComponent = componentUtils.assembleComponent(
						magicMarkup,
						script,
						scriptModule,
						style,
					)
					HmrIgnoredModuleIds.add(transaction.moduleId)
					fileUtils.writeComponent(transaction.moduleId, finalComponent)
				},
			})
		},
	}
}
