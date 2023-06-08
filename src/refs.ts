import type * as THREE from 'three'
import type { EffectComposer } from 'postprocessing'

interface Refs {
  camera: THREE.Camera
  composer: EffectComposer | undefined
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  root: HTMLElement
  debugRoot: HTMLElement
}

export const refs: Refs = {
  camera: undefined!,
  composer: undefined,
  debugRoot: undefined!,
  renderer: undefined!,
  root: undefined!,
  scene: undefined!,
}
