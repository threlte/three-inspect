import type * as ThreeLib from 'three'
import { type Pane, addPane, initPane } from './pane'
import { pause, run } from './update'
import type { EffectComposer } from 'postprocessing'
import { initCameraFolder } from './folders/camera'
import { initLightFolder } from './folders/lights'
import { initNav } from './pane/nav'
import { initObjectFolder } from './objects'
import { initPostFolder } from './folders/postprocessing'
import { initScene } from './scene'
import { initSceneFolder } from './folders/scene'
import { initStats } from './pane/stats'
import { setThree } from './three'

type Disposer = () => void

// eslint-disable-next-line no-use-before-define
type Plugin = (debug: Debug) => Disposer

export default class Debug {
  disposers: Disposer[] = []

  /**
   * Adds a new pane and navigation menu item.
   *
   * @param title This will be shown as a navigation menu item.
   *
   * @returns a Tweakpane.Pane instance.
   */
  addPane = addPane

  /**
   * The stats panel. Can be extended.
   */
  stats: Pane

  /**
   * Instantiates Three.js debugging and monitoring tools.
   *
   * @param THREE The THREE object used in this project.
   * @param scene The scene to debug.
   * @param camera The current camera.
   * @param renderer The rendering instance.
   * @param composer An optional EffectComposer instance.
   *
   * @returns A cleanup function to unmount and dispose the debugger.
   */
  constructor (
    THREE: typeof ThreeLib,
    scene: THREE.Scene,
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer,
    composer?: EffectComposer
  ) {
    setThree(THREE)

    const { stats, dispose: disposeStats } = initStats(renderer)
    this.stats = stats

    this.disposers.push(disposeStats)
    this.disposers.push(initPane(renderer))
    this.disposers.push(initNav())
    this.disposers.push(initLightFolder())
    this.disposers.push(initObjectFolder())
    this.disposers.push(initScene(scene))
    this.disposers.push(initCameraFolder(camera, renderer))
    this.disposers.push(initSceneFolder(scene))
    this.disposers.push(initPostFolder(composer))
    run()
  }

  /**
   * Registers a plugin.
   *
   * @param plugin A function that has the debugger as a param and returns a disposer.
   */
  registerPlugin (plugin: Plugin) {
    this.disposers.push(plugin(this))
  }

  /**
   * Disposes the debugger.
   */
  dispose () {
    pause()

    for (let i = this.disposers.length - 1; i > -1; i -= 1) {
      this.disposers[i]()
    }
  }
}
