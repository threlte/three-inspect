import type * as THREE from 'three'
import { initScene } from './scene'
import { initStats } from './pane/stats'
import { initSceneFolder } from './folders/scene'
import { initCameraFolder } from './folders/camera'
import { initPostFolder } from './folders/postprocessing'
import { stats } from './pane/stats'

import { addFolder, addPane } from './pane'
import type { EffectComposer } from 'postprocessing'
import { run } from './update'
import { setThree } from './three'

export { stats } 
export { addPane, addFolder }
export { save, storage } from './storage'

/**
 * Disposes the debugger
 */
type Disposer = () => void

/**
 * Mounts Three.js debugging and monitoring tools
 * @param three The THREE object used in this project.
 * @param scene The scene to debug.
 * @param camera The current camera.
 * @param renderer The rendering instance.
 * @param composer An optional EffectComposer instance.
 * @returns A cleanup function to unmount and dispose the debugger.
 */
export const init = (three: typeof THREE, scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer, composer?: EffectComposer): Disposer => {
  setThree(three)

  const disposeStats = initStats(renderer)
  const disposeScene = initScene(scene)
  initSceneFolder(scene)
  initCameraFolder(camera, renderer)
  initPostFolder(composer)
  run()

  return () => {
    disposeStats()
    disposeScene()
  }
}

export default {
  init,
  stats,
  addPane,
  addFolder,
}
