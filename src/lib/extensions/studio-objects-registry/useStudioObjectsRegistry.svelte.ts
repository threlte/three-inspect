import type { Object3D } from 'three'
import { useStudio } from '../../internal/extensions'
import {
	studioObjectsRegistryScope,
	type StudioObjectsRegistryActions,
	type StudioObjectsRegistryState,
} from './types'
import { Set } from 'svelte/reactivity'

export const useStudioObjectsRegistry = () => {
	const { getExtension } = useStudio()
	const { run, state } = getExtension<
		Partial<StudioObjectsRegistryState>,
		StudioObjectsRegistryActions
	>(studioObjectsRegistryScope)

	const addObject = (object: Object3D) => {
		run('addObject', object)
	}

	const removeObject = (object: Object3D) => {
		run('removeObject', object)
	}

	const objects = $derived(state.objects ?? new Set<Object3D>())

	return {
		addObject,
		removeObject,
		get objects() {
			return objects
		},
	}
}
