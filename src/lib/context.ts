import { type CurrentWritable, currentWritable } from '@threlte/core'
import { getContext, setContext } from 'svelte'

const key = Symbol('three-inspect-context')

interface InspectorContext {
  scene: CurrentWritable<THREE.Scene>
  renderer: CurrentWritable<THREE.Renderer>
  camera: CurrentWritable<THREE.PerspectiveCamera | THREE.OrthographicCamera>
}

interface setInspectorContextOptions {
  scene: THREE.Scene
  renderer: THREE.Renderer
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
}

export const setInspectorContext = (options: setInspectorContextOptions) => {
  setContext<InspectorContext>(key, {
    scene: currentWritable(options.scene),
    renderer: currentWritable(options.renderer),
    camera: currentWritable(options.camera),
  })
}

export const getInspectorContext = () => {
  return getContext<InspectorContext>(key)
}
