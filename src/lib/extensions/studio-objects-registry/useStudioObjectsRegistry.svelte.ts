import { Set } from 'svelte/reactivity'
import type { Object3D } from 'three'
import { useStudio } from '../../internal/extensions'
import {
	studioObjectsRegistryScope,
	type StudioObjectsRegistryActions,
	type StudioObjectsRegistryState,
} from './types'

export const useStudioObjectsRegistry = () => {
	const { getExtension } = useStudio()
	const extension = getExtension<Partial<StudioObjectsRegistryState>, StudioObjectsRegistryActions>(
		studioObjectsRegistryScope,
	)

	const addObject = (object: Object3D) => {
		extension.run('addObject', object)
	}

	const removeObject = (object: Object3D) => {
		extension.run('removeObject', object)
	}

	const objects = $derived(extension.state.objects ?? new Set<Object3D>())

	const isOrIsChildOfStudioObject = (object: THREE.Object3D): boolean => {
		if (!extension.state.objects) return false
		if (extension.state.objects.has(object)) return true
		if (object.parent) return isOrIsChildOfStudioObject(object.parent)
		return false
	}

	return {
		addObject,
		removeObject,
		get objects() {
			return objects
		},
		isOrIsChildOfStudioObject,
	}
}
