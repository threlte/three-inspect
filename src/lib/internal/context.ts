import { type CurrentWritable, currentWritable } from '@threlte/core'
import { type Writable, writable } from 'svelte/store'
import { getContext, setContext } from 'svelte'
import type { ThemeUtils } from 'svelte-tweakpane-ui'

const internalKey = Symbol('three-inspect-internal-context')
const publicKey = Symbol('three-inspect-context')

interface InternalContext {
	usingTransformControls: CurrentWritable<boolean>
	usingFreeCamera: CurrentWritable<boolean>
	usingRaycast: CurrentWritable<boolean>
	selectedObject: CurrentWritable<THREE.Object3D | undefined>
}

interface PublicContext {
	position: Writable<'inline' | 'draggable'>
	theme: Writable<keyof typeof ThemeUtils.presets>
}

interface SetPublicContextOptions {
	position?: 'inline' | 'draggable'
	theme?: keyof typeof ThemeUtils.presets
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
		theme: writable(options.theme ?? 'light'),
	})
}

export const getInternalContext = () => {
	return getContext<InternalContext>(internalKey)
}

export const useInspector = () => {
	return getContext<PublicContext>(publicKey)
}
