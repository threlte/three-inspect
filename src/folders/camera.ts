import { MapControls, OrbitControls } from '../lib/orbit-controls'
import { addTransformInputs } from '../inputs/transform'
import { pane } from '../pane'
import { storage } from '../lib/storage'

type Cameras = THREE.PerspectiveCamera | THREE.OrthographicCamera

export const initCameraFolder = (camera: Cameras, renderer: THREE.WebGLRenderer) => {
  const cameraFolder = pane.addFolder({ index: 0, title: 'Camera' })

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

  let controls: OrbitControls | undefined

  const debugCamera = storage.getJSON('camera') as null | {
    target: number[]
    quaternion: number[]
    position: number[]
    zoom: number
  }

  if (debugCamera !== null) {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.target.fromArray(debugCamera.target)
    camera.quaternion.fromArray(debugCamera.quaternion)
    camera.position.fromArray(debugCamera.position)
    camera.zoom = debugCamera.zoom
    controls.update()
  }

  const controlOptions = [
    Controls.NONE,
    Controls.ORBIT,
    Controls.MAP,
  ]

  const savePosition = () => {
    storage.setJSON('camera', {
      position: camera.position.toArray(),
      quaternion: camera.quaternion.toArray(),
      target: controls!.target.toArray(),
      zoom: camera.zoom,
    })
  }

  const setEnabledControls = () => {
    controls?.dispose()
    window.removeEventListener('pointerup', savePosition)
    window.removeEventListener('wheel', savePosition)

    /**
     * No controls
     */
    if (params.controls === Controls.NONE) {
      storage.remove('camera')
      storage.remove('controls')

    /**
     * Map Controls
     */
    } else if (params.controls === Controls.MAP) {
      storage.setJSON('controls', Controls.MAP)
      controls = new MapControls(camera, renderer.domElement)
      window.addEventListener('pointerup', savePosition, { passive: true })
      window.addEventListener('wheel', savePosition, { passive: true })

    /**
     * Orbit Controls
     */
    } else if (params.controls === Controls.ORBIT) {
      storage.setJSON('controls', Controls.ORBIT)
      controls = new OrbitControls(camera, renderer.domElement)
      window.addEventListener('pointerup', savePosition, { passive: true })
      window.addEventListener('wheel', savePosition, { passive: true })
    }
  }

  const titles = ['none', 'orbit', 'map']

  cameraFolder.addInput(params, 'controls', {
    cells: (x: number, y: number) => {
      return {
        title: titles[controlOptions[(y * 3) + x]],
        value: controlOptions[(y * 3) + x],
      }
    },
    groupName: 'controls',
    label: 'debug controls',
    size: [3, 1],
    view: 'radiogrid',
  }).on('change', setEnabledControls)

  const perspective = camera as THREE.PerspectiveCamera
  const ortho = camera as THREE.OrthographicCamera

  const handleCameraChange = () => {
    camera.updateProjectionMatrix()
  }

  cameraFolder.addInput(camera, 'near').on('change', handleCameraChange)
  cameraFolder.addInput(camera, 'far').on('change', handleCameraChange)
  const input = cameraFolder.addInput(camera, 'zoom').on('change', handleCameraChange)

  window.addEventListener('wheel', () => input.refresh())

  if (ortho.isOrthographicCamera) {
    cameraFolder.addInput(ortho, 'bottom').on('change', handleCameraChange)
    cameraFolder.addInput(ortho, 'left').on('change', handleCameraChange)
    cameraFolder.addInput(ortho, 'right').on('change', handleCameraChange)
    cameraFolder.addInput(ortho, 'top').on('change', handleCameraChange)
  }

  if (perspective.isPerspectiveCamera) {
    cameraFolder.addInput(perspective, 'fov').on('change', handleCameraChange)
    cameraFolder.addInput(perspective, 'filmOffset').on('change', handleCameraChange)
    cameraFolder.addInput(perspective, 'filmGauge').on('change', handleCameraChange)
  }

  setEnabledControls()

  const disposeTransformInputs = addTransformInputs(cameraFolder, camera)

  return () => {
    cameraFolder.dispose()
    camera.position.set = setPosition
    disposeTransformInputs()
    controls?.dispose()
  }
}
