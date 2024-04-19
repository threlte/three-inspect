import { resolvePropertyPath } from '@threlte/core'
import type { Material, Object3D, OrthographicCamera, PerspectiveCamera } from 'three'

export const haveProperty = <T = any>(objects: any[], property: string): objects is T[] => {
	return objects.every((object) => property in object)
}

export const areOfType = <T = any>(objects: any[], isType: string): objects is T[] => {
	return objects.every((object) => isType in object)
}

export const readFromFirstObject = (objects: any[], propertyPath: string) => {
	const { target, key } = resolvePropertyPath(objects[0], propertyPath)
	return target[key]
}

export const areCamera = (
	objects: any[],
): objects is (PerspectiveCamera | OrthographicCamera)[] => {
	return (
		areOfType<PerspectiveCamera>(objects, 'isPerspectiveCamera') ||
		areOfType<OrthographicCamera>(objects, 'isOrthographicCamera')
	)
}

export const haveMaterialProperty = (
	objects: any[],
): objects is (Object3D & { material: Material })[] => {
	return haveProperty<Object3D & { material: Material }>(objects, 'material')
}
