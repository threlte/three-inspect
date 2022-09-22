import type * as THREE from 'three'
import { addLightFolder } from './folders/lights'

type Disposer = () => void

const lights = new Set<THREE.Light>()
const disposers = new WeakMap<THREE.Light, Disposer>()

export const register = (light: THREE.Light) => {
  lights.add(light)
  const dispose = addLightFolder(light)
  disposers.set(light, dispose)
}

export const deregister = (light: THREE.Light) => {
  lights.delete(light)
  disposers.get(light)!()
  disposers.delete(light)
}

