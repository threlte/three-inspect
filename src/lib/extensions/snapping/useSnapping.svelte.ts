import { useStudio } from '../../internal/extensions'
import { snappingScope, type SnappingActions, type SnappingState } from './types'

export const useSnapping = () => {
	const { getExtension } = useStudio()

	const { run, state } = getExtension<SnappingState, SnappingActions>(snappingScope)

	const setEnabled = (enabled: boolean) => {
		run('setEnabled', enabled)
	}

	const toggleEnabled = () => {
		run('toggleEnabled')
	}

	const setTranslate = (translate: number) => {
		run('setTranslate', translate)
	}

	const setRotate = (rotate: number) => {
		run('setRotate', rotate)
	}

	const setScale = (scale: number) => {
		run('setScale', scale)
	}

	return {
		get enabled() {
			return state.enabled
		},
		get translate() {
			return state.translate
		},
		get rotate() {
			return state.rotate
		},
		get scale() {
			return state.scale
		},
		setEnabled,
		toggleEnabled,
		setTranslate,
		setRotate,
		setScale,
	}
}
