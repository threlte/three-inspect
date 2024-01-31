import type { Object3D } from 'three'
import { useStudio } from '../../internal/extensions'

export const objectSelectionScope = 'object-selection'

export type ObjectSelectionState = {
	selectedObjects: Object3D[]
}

export type ObjectSelectionActions = {
	selectObjects: (objects: Object3D[]) => void
	clearSelection: () => void
}

export const objectSelection = () => {
	const { addExtension: registerExtension } = useStudio()

	registerExtension<ObjectSelectionState, ObjectSelectionActions>({
		scope: objectSelectionScope,
		state: () => ({
			selectedObjects: [],
		}),
		actions: {
			selectObjects({ select }, objects) {
				select((s) => s.selectedObjects).set(objects)
			},
			clearSelection({ select }) {
				select((s) => s.selectedObjects).set([])
			},
		},
	})
}
