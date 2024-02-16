import { derived } from 'svelte/store'
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

	const selectedObjects = derived(
		state.select((s) => s.selectedObjects),
		(objects) => {
			return (objects as Object3D[] | undefined) ?? []
		},
	)

	const selectObjects = (objects: Object3D[]) => {
		run('selectObjects', objects)
	}

	const clearSelection = () => {
		run('clearSelection')
	}

	return {
		selectedObjects,
		selectObjects,
		clearSelection,
	}
}
