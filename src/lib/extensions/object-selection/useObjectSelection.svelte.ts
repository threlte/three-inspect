import type { Object3D } from 'three'
import { useStudio } from '../../internal/extensions'
import {
	objectSelectionScope,
	type ObjectSelectionActions,
	type ObjectSelectionState,
} from './types'

export const useObjectSelection = () => {
	const { getExtension } = useStudio()
	const { state, run } = getExtension<ObjectSelectionState, ObjectSelectionActions>(
		objectSelectionScope,
	)

	const selectObjects = (objects: Object3D[]) => {
		run('selectObjects', objects)
	}

	const clearSelection = () => {
		run('clearSelection')
	}

	const addToSelection = (objects: Object3D[]) => {
		run('addToSelection', objects)
	}

	const removeFromSelection = (objects: Object3D[]) => {
		run('removeFromSelection', objects)
	}

	const toggleSelection = (objects: Object3D[]) => {
		run('toggleSelection', objects)
	}

	const selectedObjects = $derived(state.selectedObjects ?? [])

	return {
		get selectedObjects() {
			return selectedObjects
		},
		selectObjects,
		clearSelection,
		addToSelection,
		removeFromSelection,
		toggleSelection,
	}
}
