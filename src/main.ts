import { initScene } from './scene'
import { initStats } from './pane/stats'
import { initSceneFolder } from './folders/scene'
import { initCameraFolder } from './folders/camera'
import { initPostFolder } from './folders/postprocessing'

import { addFolder, addPane } from './pane'
import type { EffectComposer } from 'postprocessing'
import { run } from './update'

export { stats } from './pane/stats'
export { addPane, addFolder }
export { save, storage } from './storage'

/**
 * Disposes the debugger
 */
type Disposer = () => void

/**
 * Mounts Three.js debugging and monitoring tools
 * @param scene The scene to debug.
 * @param camera The current camera.
 * @param renderer The rendering instance.
 * @param composer An optional EffectComposer instance.
 * @returns A cleanup function to unmount and dispose the debugger.
 */
export const init = (scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer, composer?: EffectComposer): Disposer => {
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
  init
}