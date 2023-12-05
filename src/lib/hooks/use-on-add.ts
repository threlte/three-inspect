import * as THREE from 'three'
import { onDestroy } from 'svelte'

const add = THREE.Object3D.prototype.add

type Callback = (object: THREE.Object3D) => void

export const addFns = new Set<Callback>()

THREE.Object3D.prototype.add = function (...objects: THREE.Object3D[]) {
  add.call(this, ...objects)
  addFns.forEach((fn) => objects.forEach((object) => fn(object)))
  return this
}

export const useOnAdd = (callback: Callback) => {
  addFns.add(callback)
  onDestroy(() => addFns.delete(callback))
}
