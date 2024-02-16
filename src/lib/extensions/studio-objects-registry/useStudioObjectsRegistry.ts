import type { Object3D } from 'three'
import { useStudio } from '../../internal/extensions'
import {
	studioObjectsRegistryScope,
	type StudioObjectsRegistryActions,
	type StudioObjectsRegistryState,
} from './types'

export const useStudioObjectsRegistry = () => {
	const { getExtension } = useStudio()
	const { run } = getExtension<StudioObjectsRegistryState, StudioObjectsRegistryActions>(
		studioObjectsRegistryScope,
	)

	const addObject = (object: Object3D) => {
		run('addObject', object)
	}

	const removeObject = (object: Object3D) => {
		run('removeObject', object)
	}

	return {
		addObject,
		removeObject,
	}
}
