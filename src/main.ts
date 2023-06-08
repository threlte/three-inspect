import './patch/folders'
import { Controls, setEnabledControls } from './lib/controls'
import { pause, run } from './update'
import type { EffectComposer } from 'postprocessing'
import type { Pane } from './pane'
import css from './main.css?inline'
import { initElements } from './elements'
import { initSceneHelpers } from './folders/scene'
import { load } from 'trzy'
import { refs } from './refs'

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
   * @param args Arguments required by three-inspect
   * @param args.scene The scene to inspect.
   * @param args.camera The current camera.
   * @param args.renderer The rendering instance.
   * @param args.composer An optional pmndrs/postprocessing EffectComposer instance.
   * @param args.options Optional setup and rendering options.
   * @param args.options.location The location of the inspector. Defaults to 'right'. Options are 'right', 'overlay'.
   *
   * @returns A cleanup function to unmount and dispose the inspector.
   */
  constructor ({
    scene,
    camera,
    renderer,
    composer,
    options = {},
  }: {
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
    renderer: THREE.WebGLRenderer,
    composer?: EffectComposer,
    options?: {
      location?: 'right' | 'overlay'
    }
  }) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!scene) {
      const msg = 'three-inspect constructor arguments have changed. Consult docs for new args: https://www.npmjs.com/package/three-inspect'
      throw new Error(msg)
    }

    refs.scene = scene
    refs.camera = camera
    refs.renderer = renderer
    refs.composer = composer ?? undefined

    const { disposers, addPane } = initElements({
      location: 'right',
      ...options,
    })

    this.addPane = addPane
    this.disposers.push(...disposers, initSceneHelpers())

    const controls = load<Controls>('three-inspect.controls')

    if (controls !== null) {
      setEnabledControls(controls, camera)
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
  dispose = () => {
    pause()

    for (let i = this.disposers.length - 1; i > -1; i -= 1) {
      this.disposers[i]()
    }

    this.disposers.slice(0, this.disposers.length)
  }
}
