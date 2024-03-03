import type { Plugin } from 'vite'
import {
	addStudioRuntimeProps,
	assembleComponent,
	componentFromCode,
	componentNeedsTransform,
	disassembleComponent,
	prepareMarkup,
	writeComponent,
} from './utils/component'

export const plugin: () => Plugin = () => {
	return {
		name: 'Threlte-Inspector',
		enforce: 'pre',
		transform(code, id) {
			if (!id.endsWith('.svelte')) return
			if (!componentNeedsTransform(code)) return

			const component = componentFromCode(code)

			const { markup, script, scriptModule, style } = disassembleComponent(component)

			const { isModified } = prepareMarkup(markup)

			if (isModified) {
				assembleComponent(markup, script, scriptModule, style)
				writeComponent(id, markup.toString())
			}

			addStudioRuntimeProps(markup, id)

			const finalComponent = assembleComponent(markup, script, scriptModule, style)

			return {
				code: finalComponent,
				map: markup.generateMap(),
			}
		},
	}
}
