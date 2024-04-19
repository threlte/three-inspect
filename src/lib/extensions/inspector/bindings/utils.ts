import { resolvePropertyPath } from '@threlte/core'
import type { OrthographicCamera, PerspectiveCamera } from 'three'

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
