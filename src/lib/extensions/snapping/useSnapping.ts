import { useStudio } from '../../internal/extensions.svelte'
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
		enabled: state.select((s) => s.enabled),
		translate: state.select((s) => s.translate),
		rotate: state.select((s) => s.rotate),
		scale: state.select((s) => s.scale),
		setEnabled,
		toggleEnabled,
		setTranslate,
		setRotate,
		setScale,
	}
}
