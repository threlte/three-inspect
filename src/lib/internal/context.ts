import { type CurrentWritable, currentWritable } from '@threlte/core'
import { type Writable, writable } from 'svelte/store'
import { getContext, setContext } from 'svelte'
import type { ThemeUtils } from 'svelte-tweakpane-ui'
import { persisted } from './persisted'
import { Object3D } from 'three'

const internalKey = Symbol('three-inspect-internal-context')
const publicKey = Symbol('three-inspect-context')

export type SelectedObject =
	| THREE.Scene
	| THREE.Light
	| THREE.PerspectiveCamera
	| THREE.OrthographicCamera

export type DefaultPane = 'Toolbar' | 'SceneGraph' | 'Inspector'
export type OptionalPane = 'Console' | 'Monitor'

export interface ToolSettings {
	transformControls: {
		enabled: boolean
		inUse: boolean
	}
	freeCamera: {
		enabled: boolean
	}
}

export interface GizmoSettings {
	viewportGizmo: {
		visible: boolean
	}
	grid: {
		visible: boolean
		color: string
		units: number
		plane: 'xz' | 'xy' | 'zy'
	}
	axes: {
		visible: boolean
	}
	helpers: {
		visible: boolean
	}
}

interface Transaction {
	fileId: string
	componentIndex: number
	attributeName: string
	attributeValue: unknown
}

export interface SyncSettings {
	mode: 'manual' | 'auto'
	saving: boolean
	transactions: Transaction[]
}

interface InternalContext {
	defaultCamera: CurrentWritable<THREE.Camera | undefined>
	usingRaycast: CurrentWritable<boolean>
	selectedObject: CurrentWritable<SelectedObject | undefined>
	studioObjects: CurrentWritable<Set<Object3D>>
	optionalPanes: Writable<Record<OptionalPane, boolean>>
	gizmoSettings: Writable<GizmoSettings>
	toolSettings: Writable<ToolSettings>
	syncSettings: Writable<SyncSettings>
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
		defaultCamera: currentWritable(undefined),
		usingRaycast: currentWritable(false),
		selectedObject: currentWritable<SelectedObject | undefined>(undefined),
		studioObjects: currentWritable(new Set()),
		optionalPanes: persisted('internalContext.optionalPanes', {
			Console: false,
			Monitor: false,
		}),
		gizmoSettings: persisted('internalContext.gizmoSettings', {
			viewportGizmo: {
				visible: true,
			},
			grid: {
				visible: true,
				color: '#5f5f5f',
				units: 1,
				plane: 'xz',
			},
			axes: {
				visible: true,
			},
			helpers: {
				visible: true,
			},
		}),
		toolSettings: persisted('internalContext.toolSettings', {
			transformControls: {
				enabled: true,
				inUse: false,
			},
			freeCamera: {
				enabled: true,
			},
		}),
		syncSettings: persisted('internalContext.syncSettings', {
			mode: 'auto',
			saving: false,
			transactions: [],
		}),
	})
}

export const setPublicContext = (options: SetPublicContextOptions) => {
	setContext<PublicContext>(publicKey, {
		position: writable(options.position ?? 'inline'),
		theme: writable(options.theme ?? 'standard'),
	})
}

export const getInternalContext = () => {
	return getContext<InternalContext>(internalKey)
}

export const useInspector = () => {
	return getContext<PublicContext>(publicKey)
}
