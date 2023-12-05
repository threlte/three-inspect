import { writable } from 'svelte/store'

const selectedObject = writable<THREE.Object3D | undefined>()

const setSelectedObject = (object?: THREE.Object3D | undefined) => selectedObject.set(object)

export const useSelectedObject = () => {
  return {
    selectedObject,
    setSelectedObject,
  }
}
