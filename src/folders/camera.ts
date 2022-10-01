import { OrbitControls } from '../lib/orbit-controls'
import { addTransformInputs } from '../inputs/transform'
import { pane } from '../pane'
import { storage } from '../lib/storage'

export const initCameraFolder = (camera: THREE.Camera, renderer: THREE.WebGLRenderer) => {
  const cameraFolder = pane.addFolder({ index: 1, title: 'camera' })
  const perspective = camera as THREE.PerspectiveCamera

  // eslint-disable-next-line no-shadow
  const enum Controls {
    NONE,
    ORBIT,
    MAP,
  }

  const params = {
    controls: storage.getJSON('controls') ?? Controls.NONE,
  }

  const setPosition = camera.position.set.bind(camera.position)

  camera.position.set = (...args) => {
    if (params.controls !== Controls.NONE) {
      return camera.position
    }

    return setPosition(...args)
  }

  let orbitControls: OrbitControls | undefined

  const debugCamera = storage.getJSON('camera')

  if (debugCamera) {
    orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.target.fromArray((debugCamera as { target: number[] }).target)
    camera.quaternion.fromArray((debugCamera as { quaternion: number[] }).quaternion)
    camera.position.fromArray((debugCamera as { position: number[] }).position)
    orbitControls.update()
  }

  const controls = [
    Controls.NONE,
    Controls.ORBIT,
    Controls.MAP,
  ]

  const savePosition = () => {
    storage.setJSON('camera', {
      position: camera.position.toArray(),
      quaternion: camera.quaternion.toArray(),
      target: orbitControls!.target.toArray(),
    })
  }

  const setEnabledControls = () => {
    storage.setJSON('controls', params.controls)

    if (params.controls === Controls.NONE) {
      storage.remove('camera')
      storage.remove('controls')
      window.removeEventListener('pointerup', savePosition)
      window.removeEventListener('wheel', savePosition)
      orbitControls?.dispose()
    } else {
      orbitControls = new OrbitControls(camera, renderer.domElement)
      window.addEventListener('pointerup', savePosition, { passive: true })
      window.addEventListener('wheel', savePosition, { passive: true })
    }
  }

  const handleCameraChange = () => {
    if (perspective.isPerspectiveCamera) {
      perspective.updateProjectionMatrix()
    }
  }

  const titles = ['none', 'orbit', 'map']

  cameraFolder.addInput(params, 'controls', {
    cells: (x: number, y: number) => {
      return {
        title: titles[controls[(y * 3) + x]],
        value: controls[(y * 3) + x],
      }
    },
    groupName: 'controls',
    label: 'debug controls',
    size: [3, 1],
    view: 'radiogrid',
  }).on('change', setEnabledControls)

  if (perspective.isPerspectiveCamera) {
    cameraFolder.addInput(perspective, 'near').on('change', handleCameraChange)
    cameraFolder.addInput(perspective, 'far').on('change', handleCameraChange)
    cameraFolder.addInput(perspective, 'fov').on('change', handleCameraChange)
    cameraFolder.addInput(perspective, 'filmOffset').on('change', handleCameraChange)
    cameraFolder.addInput(perspective, 'filmGauge').on('change', handleCameraChange)
    cameraFolder.addInput(perspective, 'zoom').on('change', handleCameraChange)
  }

  setEnabledControls()

  const disposeTransformInputs = addTransformInputs(cameraFolder, camera)

  return () => {
    cameraFolder.dispose()
    camera.position.set = setPosition
    disposeTransformInputs()
    orbitControls?.dispose()
  }
}
