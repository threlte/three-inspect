import Inspector from './Vanilla.svelte'
import { Scene, PerspectiveCamera, OrthographicCamera, WebGLRenderer } from 'three'

export interface CreateInspectorOptions {
	scene: Scene
	camera: PerspectiveCamera | OrthographicCamera
	renderer: WebGLRenderer
}

export const createInspector = (target: HTMLElement, options: CreateInspectorOptions) => {
	const inspector = new Inspector({ target, props: options })
	return () => {
		inspector.$destroy()
	}
}
