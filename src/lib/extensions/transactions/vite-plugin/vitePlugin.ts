import type { Plugin } from 'vite'
import { createRPCServer } from 'vite-dev-rpc'
import type { ClientFunctions, ServerFunctions } from '../types'
import { addStudioRuntimeProps, componentNeedsTransform } from './utils/componentParser'
import { assembleComponent, disassembleComponent } from './utils/componentUtils'
import { toMagicString } from './utils/magicStringUtils'

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
			createRPCServer<ClientFunctions, ServerFunctions>('threlte-studio', server.ws, {})
		},
	}
}
