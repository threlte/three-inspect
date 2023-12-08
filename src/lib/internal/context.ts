import { type CurrentWritable, currentWritable } from '@threlte/core'
import { getContext, setContext } from 'svelte'

const key = Symbol('three-inspect-internal-context')

interface InternalContext {
  usingTransformControls: CurrentWritable<boolean>
  scene: CurrentWritable<THREE.Scene>
  renderer: CurrentWritable<THREE.Renderer>
  camera: CurrentWritable<THREE.PerspectiveCamera | THREE.OrthographicCamera>
  selectedObject: CurrentWritable<THREE.Object3D | undefined>
}

interface SetInternalContextOptions {
  scene: THREE.Scene
  renderer: THREE.Renderer
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
  selectedObject?: THREE.Object3D
}

export const setInternalContext = (options: SetInternalContextOptions) => {
  setContext<InternalContext>(key, {
    usingTransformControls: currentWritable(false),
    scene: currentWritable(options.scene),
    renderer: currentWritable(options.renderer),
    camera: currentWritable(options.camera),
    selectedObject: currentWritable<THREE.Object3D | undefined>(options.selectedObject),
  })
}

export const getInternalContext = () => {
  return getContext<InternalContext>(key)
}
