import Inspector from './Vanilla.svelte'

export interface CreateInspectorOptions {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
  renderer: THREE.WebGLRenderer
}

export const createInspector = (target: HTMLElement, options: CreateInspectorOptions) => {
  const inspector = new Inspector({ target, props: options })
  return () => { inspector.$destroy() }
}
