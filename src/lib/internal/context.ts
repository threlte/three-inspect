import { type CurrentWritable, currentWritable } from '@threlte/core'
import { type Writable, writable } from 'svelte/store'
import { getContext, setContext } from 'svelte'

const internalKey = Symbol('three-inspect-internal-context')
const publicKey = Symbol('three-inspect-context')

interface InternalContext {
  usingTransformControls: CurrentWritable<boolean>
  usingFreeCamera: CurrentWritable<boolean>
  usingRaycast: CurrentWritable<boolean>
  selectedObject: CurrentWritable<THREE.Object3D | undefined>
}

interface PublicContext {
  position: Writable<'inline' | 'draggable' | 'fixed'>
}

interface SetPublicContextOptions {
  position?: 'inline' | 'draggable' | 'fixed'
}

export const setInternalContext = () => {
  setContext<InternalContext>(internalKey, {
    usingTransformControls: currentWritable(false),
    usingFreeCamera: currentWritable(false),
    usingRaycast: currentWritable(false),
    selectedObject: currentWritable<THREE.Object3D | undefined>(undefined),
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
