import * as THREE from 'three'
import { erase, save, storage } from '../storage'
import { addFolder, pane } from '../pane'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { addTransformInputs } from '../inputs/transform'

export const initCameraFolder = (camera: THREE.Camera, renderer: THREE.WebGLRenderer) => {

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

  const orbitControls = new OrbitControls(camera, renderer.domElement)
  
  if (storage.debugCamera) {
    const cam = storage.debugCamera as {
      target: number[]
      quaternion: number[]
      position: number[]
    }
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
      target: orbitControls.target.toArray(),
    })
  }
  
  const setEnabledControls = () => {
    save('controls', params.controls)
  
    if (params.controls === constants.CONTROLS_NONE) {
      erase('debugCamera')
      orbitControls.enabled = false
      window.removeEventListener('pointerup', savePosition)
      window.removeEventListener('wheel', savePosition)
    } else {
      orbitControls.enabled = true
      window.addEventListener('pointerup', savePosition, { passive: true })
      window.addEventListener('wheel', savePosition, { passive: true })
    }
  }
  
  const handleCameraChange = () => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.updateProjectionMatrix()
    }
  }
  
  const cameraFolder = addFolder(pane, 'camera', 1)
  
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

  if (camera instanceof THREE.PerspectiveCamera) {
    cameraFolder.addInput(camera, 'near').on('change', handleCameraChange)
    cameraFolder.addInput(camera, 'far').on('change', handleCameraChange)
    cameraFolder.addInput(camera, 'fov').on('change', handleCameraChange)
    cameraFolder.addInput(camera, 'filmOffset').on('change', handleCameraChange)
    cameraFolder.addInput(camera, 'filmGauge').on('change', handleCameraChange)
    cameraFolder.addInput(camera, 'zoom').on('change', handleCameraChange)
  }
  
  setEnabledControls()
  
  const disposeTransformInputs =  addTransformInputs(cameraFolder, camera)

  return () => {
    camera.position.set = setPosition
    disposeTransformInputs()
    orbitControls.dispose()
    cameraFolder.dispose()
  }
}
