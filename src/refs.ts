import type * as THREE from 'three'
import type { EffectComposer } from 'postprocessing'

interface Refs {
  camera: THREE.Camera
  composer: EffectComposer | null
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  root: HTMLElement
  debugRoot: HTMLElement
}

export const refs: Refs = {
  camera: null!,
  composer: null,
  debugRoot: null!,
  renderer: null!,
  root: null!,
  scene: null!,
}
