import { useStudio } from '../../internal/extensions'
import { spaceScope, type SpaceActions, type SpaceState } from './types'

export const useSpace = () => {
	const { getExtension } = useStudio()

	const { run, state } = getExtension<SpaceState, SpaceActions>(spaceScope)

	const setSpace = (space: SpaceState['space']) => {
		run('setSpace', space)
	}

	const toggleSpace = () => {
		run('toggleSpace')
	}

	const space = $derived(state.space)

	return {
		get space() {
			return space
		},
		setSpace,
		toggleSpace,
	}
}
