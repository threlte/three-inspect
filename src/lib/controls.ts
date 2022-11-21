import { MapControls, OrbitControls } from './orbit-controls'
import { refs } from '../refs'
import { storage } from './storage'
import { createOrbitControlsGizmo } from '../elements/gizmo'

export type Cameras = THREE.PerspectiveCamera | THREE.OrthographicCamera

// eslint-disable-next-line no-shadow
export const enum Controls {
  NONE,
  ORBIT,
  MAP,
}

let controls: OrbitControls | undefined

export const setEnabledControls = (type: Controls, camera: Cameras) => {
  const { renderer } = refs

  const savePosition = () => {
    storage.setJSON('camera', {
      position: camera.position.toArray(),
      quaternion: camera.quaternion.toArray(),
      target: controls?.target.toArray(),
      zoom: camera.zoom,
    })
  }

  if (controls !== undefined) {
    controls.dispose()
    window.removeEventListener('pointerup', savePosition)
    window.removeEventListener('wheel', savePosition)
  }

  /**
   * Map Controls
   */
  if (type === Controls.MAP) {
    storage.setNumber('controls', Controls.MAP)
    controls = new MapControls(camera, renderer.domElement)
    window.addEventListener('pointerup', savePosition, { passive: true })
    window.addEventListener('wheel', savePosition, { passive: true })

  /**
   * Orbit Controls
   */
  } else if (type === Controls.ORBIT) {
    storage.setNumber('controls', Controls.ORBIT)
    controls = new OrbitControls(camera, renderer.domElement)
    window.addEventListener('pointerup', savePosition, { passive: true })
    window.addEventListener('wheel', savePosition, { passive: true })

    createOrbitControlsGizmo(renderer.domElement.parentElement!, controls)

  /**
   * No controls
   */
  } else {
    storage.remove('camera')
    storage.remove('controls')
  }
}
