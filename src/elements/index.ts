import type { EffectComposer } from 'postprocessing'
import { createCanvas } from './canvas'
import { createControls } from './controls'
import { initScene } from '../scene'
import { initStats } from '../pane/stats'

export const initElements = (scene: THREE.Scene, renderer: THREE.WebGLRenderer, composer?: EffectComposer) => {
  const root = document.createElement('div')
  const canvas = createCanvas(renderer)
  const { controls, nav, treeroot, treeview, pane } = createControls()

  root.append(canvas.dom)
  root.append(controls)

  const disposeStats = initStats(controls)

  document.body.append(root)

  const dispose = initScene(treeview, treeroot, pane, scene, renderer, composer)

  let width = window.innerWidth

  const handleResize = () => {
    const newWidth = window.innerWidth
    const delta = newWidth - width
    canvas.width += delta
    width = newWidth
  }

  window.addEventListener('resize', handleResize, { passive: true })

  return () => {
    disposeStats()
    window.removeEventListener('resize', handleResize)
    dispose()
  }
}
