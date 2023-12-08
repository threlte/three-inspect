import { type CurrentWritable, currentWritable } from '@threlte/core'
import { type Writable, writable } from 'svelte/store'
import { getContext, setContext } from 'svelte'

const internalKey = Symbol('three-inspect-internal-context')
const publicKey = Symbol('three-inspect-context')

interface InternalContext {
  usingTransformControls: CurrentWritable<boolean>
  usingFreeCamera: CurrentWritable<boolean>
  usingRaycast: CurrentWritable<boolean>
  scene: CurrentWritable<THREE.Scene>
  renderer: CurrentWritable<THREE.Renderer>
  camera: CurrentWritable<THREE.PerspectiveCamera | THREE.OrthographicCamera>
  selectedObject: CurrentWritable<THREE.Object3D | undefined>
}

interface PublicContext {
  position: Writable<'inline' | 'draggable' | 'fixed'>
}

interface SetInternalContextOptions {
  position?: 'inline' | 'draggable' | 'fixed'
  scene: THREE.Scene
  renderer: THREE.Renderer
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
  selectedObject?: THREE.Object3D
}

interface SetPublicContextOptions {
  position?: 'inline' | 'draggable' | 'fixed'
}

export const setInternalContext = (options: SetInternalContextOptions) => {
  setContext<InternalContext>(internalKey, {
    usingTransformControls: currentWritable(false),
    usingFreeCamera: currentWritable(false),
    usingRaycast: currentWritable(false),
    scene: currentWritable(options.scene),
    renderer: currentWritable(options.renderer),
    camera: currentWritable(options.camera),
    selectedObject: currentWritable<THREE.Object3D | undefined>(options.selectedObject),
  })
}

export const setPublicContext = (options: SetPublicContextOptions) => {
  setContext<PublicContext>(publicKey, {
    position: writable(options.position ?? 'inline'),
  })
}

export const getInternalContext = () => {
  return getContext<InternalContext>(internalKey)
}

export const useInspector = () => {
  return getContext<PublicContext>(publicKey)
}
