import { type Cameras, Controls, setEnabledControls } from '../lib/controls'
import type { EffectComposer } from 'postprocessing'
import type { Pane } from '../pane'
import { addPostInputs } from './postprocessing'
import { addTransformInputs } from './transform'
import { storage } from '../lib/storage'

export type { Cameras }

const controlOptions = [
  Controls.NONE,
  Controls.ORBIT,
  Controls.MAP,
]

const params = {
  controls: (storage.getNumber('controls') as Controls | null) ?? Controls.NONE,
}

export const addCameraInputs = (pane: Pane, camera: Cameras, renderer: THREE.WebGLRenderer, composer: EffectComposer) => {
  const titles = ['none', 'orbit', 'map']

  pane
    .addInput(params, 'controls', {
      cells: (x: number, y: number) => ({
        title: titles[controlOptions[(y * 3) + x]],
        value: controlOptions[(y * 3) + x],
      }),
      groupName: 'controls',
      label: 'debug controls',
      size: [3, 1],
      view: 'radiogrid',
    })
    .on('change', () => setEnabledControls(camera, renderer, params.controls))

  const handleCameraChange = () => {
    camera.updateProjectionMatrix()
  }

  pane.addInput(camera, 'near').on('change', handleCameraChange)
  pane.addInput(camera, 'far').on('change', handleCameraChange)
  const zoomInput = pane.addInput(camera, 'zoom').on('change', handleCameraChange)

  const updateZoomInput = () => {
    zoomInput.refresh()
  }

  window.addEventListener('wheel', updateZoomInput, { passive: true })

  if ('isOrthographicCamera' in camera) {
    pane.addInput(camera, 'bottom').on('change', handleCameraChange)
    pane.addInput(camera, 'left').on('change', handleCameraChange)
    pane.addInput(camera, 'right').on('change', handleCameraChange)
    pane.addInput(camera, 'top').on('change', handleCameraChange)
  }

  if ('isPerspectiveCamera' in camera) {
    pane.addInput(camera, 'fov').on('change', handleCameraChange)
    pane.addInput(camera, 'filmOffset').on('change', handleCameraChange)
    pane.addInput(camera, 'filmGauge').on('change', handleCameraChange)
  }

  const disposeTransformInputs = addTransformInputs(pane, camera)
  const diposePostInputs = addPostInputs(pane, composer)

  return () => {
    window.removeEventListener('wheel', updateZoomInput)
    disposeTransformInputs()
    diposePostInputs()
  }
}
