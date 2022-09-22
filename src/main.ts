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

export const init = (scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer, composer?: EffectComposer) => {
  const disposeStats = initStats(renderer)
  initScene(scene)
  initSceneFolder(scene)
  initCameraFolder(camera, renderer)
  initPostFolder(composer)
  run()

  return () => {
    disposeStats()
  }
}

export default {
  init
}