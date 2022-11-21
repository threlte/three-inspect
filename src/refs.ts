import type * as THREE from 'three'
import type { EffectComposer } from 'postprocessing'

interface Refs {
  THREE: typeof THREE
  camera: THREE.Camera
  composer: EffectComposer | null
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
}

export const refs: Refs = {
  THREE: null!,
  camera: null!,
  composer: null,
  renderer: null!,
  scene: null!,
}
