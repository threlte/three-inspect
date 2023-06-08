import * as THREE from 'three'
import { type Cameras, Controls, setEnabledControls } from '../lib/controls'
import type { Pane } from '../pane'
import { addPostInputs } from './postprocessing'
import { addTransformInputs } from './transform'
import { addUserdataInput } from './userdata'
import { load } from 'trzy'
import { refs } from '../refs'

const controlOptions = [
  Controls.NONE,
  Controls.ORBIT,
]

const params = {
  controls: load<Controls>('three-inspect.controls') ?? Controls.NONE,
}

export const addCameraInputs = (pane: Pane, camera: Cameras) => {
  const titles = ['none', 'orbit', 'map']

  pane
    .addInput(params, 'controls', {
      cells: (x: number, y: number) => ({
        title: titles[controlOptions[(y * 3) + x]],
        value: controlOptions[(y * 3) + x],
      }),
      groupName: 'controls',
      label: 'inspect controls',
      size: [2, 1],
      view: 'radiogrid',
    })
    .on('change', () => setEnabledControls(params.controls, camera))

  const handleCameraChange = () => {
    camera.updateProjectionMatrix()
  }

  pane.addInput(camera, 'near').on('change', handleCameraChange)
  pane.addInput(camera, 'far').on('change', handleCameraChange)
  const zoomInput = pane.addInput(camera, 'zoom').on('change', handleCameraChange)

  const updateZoomInput = () => zoomInput.refresh()

  window.addEventListener('wheel', updateZoomInput, { passive: true })

  if (camera instanceof THREE.OrthographicCamera) {
    pane.addInput(camera, 'bottom').on('change', handleCameraChange)
    pane.addInput(camera, 'left').on('change', handleCameraChange)
    pane.addInput(camera, 'right').on('change', handleCameraChange)
    pane.addInput(camera, 'top').on('change', handleCameraChange)
  }

  if (camera instanceof THREE.PerspectiveCamera) {
    pane.addInput(camera, 'fov').on('change', handleCameraChange)
    pane.addInput(camera, 'filmOffset').on('change', handleCameraChange)
    pane.addInput(camera, 'filmGauge').on('change', handleCameraChange)
  }

  const disposers: Disposer[] = []
  disposers.push(
    addTransformInputs(pane, camera),
    addUserdataInput(pane, camera)
  )

  if (refs.composer !== null) {
    disposers.push(addPostInputs(pane))
  }

  disposers.push(() => window.removeEventListener('wheel', updateZoomInput))
  return disposers
}

export { type Cameras } from '../lib/controls'
