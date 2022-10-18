import type * as ThreeLib from 'three'
import { Controls, setEnabledControls } from './lib/controls'
import { type Pane, addPane } from './pane'
import { pause, run } from './update'
import type { EffectComposer } from 'postprocessing'
import css from './main.css?inline'
import { initElements } from './elements'
import { initNav } from './pane/nav'
import { initSceneHelpers } from './folders/scene'
import { initStats } from './pane/stats'
import { setThree } from './three'
import { storage } from './lib/storage'

const style = document.createElement('style')
style.textContent = css
document.head.append(style)

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
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
    renderer: THREE.WebGLRenderer,
    composer?: EffectComposer
  ) {
    setThree(THREE)

    const { stats, dispose: disposeStats } = initStats()
    this.stats = stats

    this.disposers.push(initElements(scene, renderer, composer))
    this.disposers.push(initNav())
    this.disposers.push(initSceneHelpers(scene))
    this.disposers.push(disposeStats)
    setEnabledControls(camera, renderer, (storage.getNumber('controls') as Controls | null) ?? Controls.NONE)
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

    this.disposers.slice(0, this.disposers.length)
  }
}
