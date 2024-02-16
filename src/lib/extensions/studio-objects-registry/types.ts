import type { Object3D } from 'three'

export const studioObjectsRegistryScope = 'studio-objects-registry'

export type StudioObjectsRegistryState = {
	objects: Set<Object3D>
}

export type StudioObjectsRegistryActions = {
	addObject: (object: Object3D) => void
	removeObject: (object: Object3D) => void
}
