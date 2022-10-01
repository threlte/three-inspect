import { erase, save, storage } from '../storage'
import { OrbitControls } from '../lib/orbit-controls'
import { addTransformInputs } from '../inputs/transform'
import { pane } from '../pane'

export const initCameraFolder = (camera: THREE.Camera, renderer: THREE.WebGLRenderer) => {
  const perspective = camera as THREE.PerspectiveCamera

  const constants = {
    CONTROLS_MAP: 2,
    CONTROLS_NONE: 0,
    CONTROLS_ORBIT: 1,
  }

  const params = {
    controls: storage.controls ?? constants.CONTROLS_NONE,
  }

  const setPosition = camera.position.set.bind(camera.position)

  camera.position.set = (...args) => {
    if (params.controls !== constants.CONTROLS_NONE) {
      return camera.position
    }

    return setPosition(...args)
  }

  let orbitControls: OrbitControls | undefined

  if (storage.debugCamera) {
    const cam = storage.debugCamera as {
      target: number[]
      quaternion: number[]
      position: number[]
    }
    orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.target.fromArray(cam.target)
    camera.quaternion.fromArray(cam.quaternion)
    camera.position.fromArray(cam.position)
    orbitControls.update()
  }

  const controls = [
    constants.CONTROLS_NONE,
    constants.CONTROLS_ORBIT,
    constants.CONTROLS_MAP,
  ]

  const savePosition = () => {
    save('debugCamera', {
      position: camera.position.toArray(),
      quaternion: camera.quaternion.toArray(),
      target: orbitControls!.target.toArray(),
    })
  }

  const setEnabledControls = () => {
    save('controls', params.controls)

    if (params.controls === constants.CONTROLS_NONE) {
      erase('debugCamera')
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

  const cameraFolder = pane.addFolder({ index: 1, title: 'camera' })

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
    camera.position.set = setPosition
    disposeTransformInputs()
    orbitControls?.dispose()
  }
}
