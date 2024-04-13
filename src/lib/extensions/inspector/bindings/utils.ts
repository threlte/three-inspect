import { resolvePropertyPath } from '@threlte/core'

export const haveProperty = (objects: any[], property: string) => {
	return objects.every((object) => property in object)
}

export const readFromFirstObject = (objects: any[], propertyPath: string) => {
	const { target, key } = resolvePropertyPath(objects[0], propertyPath)
	return target[key]
}

// export const readFromObjects = (objects: any[], propertyPath: string) => {
// 	const values = objects
// 		.map((object) => resolvePropertyPath(object, propertyPath))
// 		.map(({ target, key }) => target[key])
// }
