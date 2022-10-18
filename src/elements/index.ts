import type { EffectComposer } from 'postprocessing'
import { createCanvas } from './canvas'
import { createControls } from './controls'
import { initScene } from '../scene'

export const initElements = (scene: THREE.Scene, renderer: THREE.WebGLRenderer, composer?: EffectComposer) => {
  const root = document.createElement('div')
  const canvas = createCanvas(renderer)
  const { controls, nav, treeroot, treeview, pane } = createControls()

  root.append(canvas.dom)
  root.append(controls)

  document.body.append(root)

  const dispose = initScene(treeview, treeroot, controls, scene, renderer, composer)

  let width = window.innerWidth

  const handleResize = () => {
    const newWidth = window.innerWidth
    const delta = newWidth - width
    canvas.width += delta
    width = newWidth
  }

  window.addEventListener('resize', handleResize, { passive: true })

  return () => {
    window.removeEventListener('resize', handleResize)
    dispose()
  }
}

