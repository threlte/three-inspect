import { getContext, setContext } from 'svelte'
import type { CurrentWritable } from '@threlte/core'

const key = Symbol('three-inspect-context')

type InspectorContext = {
  scene: CurrentWritable<THREE.Scene>
  renderer: CurrentWritable<THREE.Renderer>
  camera: CurrentWritable<THREE.Camera>
}

export const setInspectorContext = (context: InspectorContext) => {
  setContext(key, context)
}

export const getInspectorContext = () => {
  return getContext<InspectorContext>(key)
}
