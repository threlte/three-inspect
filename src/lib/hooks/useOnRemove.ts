import { Object3D } from 'three'
import { onDestroy } from 'svelte'
import { intersectObjects } from '../internal/raycast'

// eslint-disable-next-line @typescript-eslint/unbound-method
export const remove = Object3D.prototype.remove

// eslint-disable-next-line @typescript-eslint/unbound-method
export const clear = Object3D.prototype.clear

type Callback = (object: Object3D) => void

export const removeFns = new Set<Callback>()

Object3D.prototype.remove = function (...objects: Object3D[]) {
	remove.call(this, ...objects)

	for (const object of objects) {
		intersectObjects.splice(intersectObjects.indexOf(object), 1)
	}

	for (const fn of removeFns) {
		for (const object of objects) {
			fn(object)
		}
	}

	return this
}

Object3D.prototype.clear = function () {
	clear.call(this)

	for (const object of this.children) {
		intersectObjects.splice(intersectObjects.indexOf(object), 1)
	}

	for (const fn of removeFns) {
		for (const child of this.children) {
			fn(child)
		}
	}

	return this
}

export const useOnRemove = (callback: Callback) => {
	removeFns.add(callback)

	onDestroy(() => removeFns.delete(callback))
}
