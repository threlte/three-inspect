import type * as THREE from 'three'
import type { EffectComposer } from 'postprocessing'

interface Refs {
  THREE: typeof THREE
  camera: THREE.Camera
  composer: EffectComposer | null
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  root: HTMLElement
  debugRoot: HTMLElement
}

export const refs: Refs = {
  THREE: null!,
  camera: null!,
  composer: null,
  debugRoot: null!,
  renderer: null!,
  root: null!,
  scene: null!,
}
