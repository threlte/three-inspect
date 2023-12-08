import * as THREE from 'three'
import { onDestroy } from 'svelte'

export const remove = THREE.Object3D.prototype.remove
export const clear = THREE.Object3D.prototype.clear

type Callback = (object: THREE.Object3D) => void

export const removeFns = new Set<Callback>()

THREE.Object3D.prototype.remove = function (...objects: THREE.Object3D[]) {
  remove.call(this, ...objects)
  removeFns.forEach((fn) => objects.forEach((object) => fn(object)))
  return this
}

THREE.Object3D.prototype.clear = function () {
  clear.call(this)
  removeFns.forEach((fn) => this.children.forEach((child) => fn(child)))
  return this
}

export const useOnRemove = (callback: Callback) => {
  removeFns.add(callback)
  onDestroy(() => removeFns.delete(callback))
}
