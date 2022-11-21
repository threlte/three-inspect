import './patch/folders'
import type * as ThreeLib from 'three'
import { Controls, setEnabledControls } from './lib/controls'
import { pause, run } from './update'
import type { EffectComposer } from 'postprocessing'
import type { Pane } from './pane'
import css from './main.css?inline'
import { initElements } from './elements'
import { initSceneHelpers } from './folders/scene'
import { refs } from './refs'
import { storage } from './lib/storage'

const style = document.createElement('style')
style.textContent = css
document.head.append(style)

// eslint-disable-next-line no-use-before-define
type Plugin = (inspector: Inspector) => Disposer

export default class Inspector {
  disposers: Disposer[] = []

  /**
   * Adds a new pane and navigation menu item.
   *
   * @param title This will be shown as a navigation menu item.
   *
   * @returns a Tweakpane.Pane instance.
   */
  addPane: (title: string) => Pane

  /**
   * Instantiates the Three.js inspector tools.
   *
   * @param THREE The THREE object used in this project.
   * @param scene The scene to inspect.
   * @param camera The current camera.
   * @param renderer The rendering instance.
   * @param composer An optional EffectComposer instance.
   *
   * @returns A cleanup function to unmount and dispose the inspector.
   */
  constructor (
    THREE: typeof ThreeLib,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
    renderer: THREE.WebGLRenderer,
    composer?: EffectComposer
  ) {
    refs.THREE = THREE
    refs.scene = scene
    refs.camera = camera
    refs.renderer = renderer
    refs.composer = composer ?? null

    const { disposers, addPane } = initElements()

    this.addPane = addPane
    this.disposers.push(...disposers)
    this.disposers.push(initSceneHelpers())

    const controls = storage.getNumber('controls')

    if (controls !== null) {
      setEnabledControls(controls as Controls, camera)
    }

    run()
  }

  /**
   * Registers a plugin.
   *
   * @param plugin A function that passes the inspector as a param and returns a disposer.
   */
  registerPlugin (plugin: Plugin) {
    this.disposers.push(plugin(this))
  }

  /**
   * Disposes the inspector.
   */
  dispose () {
    pause()

    for (let i = this.disposers.length - 1; i > -1; i -= 1) {
      this.disposers[i]()
    }

    this.disposers.slice(0, this.disposers.length)
  }
}
