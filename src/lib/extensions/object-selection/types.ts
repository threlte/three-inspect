import type { Object3D } from 'three'

export const objectSelectionScope = 'object-selection'

export type ObjectSelectionState = {
	selectedObjects: Object3D[]
}

export type ObjectSelectionActions = {
	selectObjects: (objects: Object3D[]) => void
	clearSelection: () => void
}
