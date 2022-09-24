import type * as ThreeLib from 'three'
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

/**
 * Disposes the debugger
 */
type Disposer = () => void

const init = (
  THREE: typeof ThreeLib,
  scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer,
  composer?: EffectComposer,
): Disposer => {
  setThree(THREE)

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
  /**
   * Mounts Three.js debugging and monitoring tools.
   * 
   * @param THREE The THREE object used in this project.
   * @param scene The scene to debug.
   * @param camera The current camera.
   * @param renderer The rendering instance.
   * @param composer An optional EffectComposer instance.
   *
   * @returns A cleanup function to unmount and dispose the debugger.
   */
  init,

  /**
   * The stats pane. Can be extended.
   */
  stats,

  /**
   * Adds a new pane and navigation menu item.
   * 
   * @param title This will be shown as a navigation menu item.
   *
   * @returns a Tweakpane.Pane instance.
   */
  addPane,

  /**
   * Adds a new folder to a pane or folder. Enables folders to have their open / closed
   * state to be saved to browser storage and preserved.
   * 
   * @param pane A Tweakpane pane or folder.
   * @param title The folder title.
   * @param index An optional index representing folder order.
   * 
   * @returns A Tweakpane folder instance.
   */
  addFolder,
}
