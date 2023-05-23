import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { createOrbitControlsGizmo } from '../elements/gizmo'
import { refs } from '../refs'
import { save } from 'trzy'

export type Cameras = THREE.PerspectiveCamera | THREE.OrthographicCamera

// eslint-disable-next-line no-shadow
export const enum Controls {
  NONE,
  ORBIT,
  // MAP,
}

let controls: OrbitControls | undefined

export const setEnabledControls = (type: Controls, camera: Cameras) => {
  const { renderer } = refs

  const savePosition = () => {
    save('three-inspect.camera', {
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

  if (type === Controls.ORBIT) {
    save('three-inspect.controls', Controls.ORBIT)
    controls = new OrbitControls(camera, renderer.domElement)
    window.addEventListener('pointerup', savePosition, { passive: true })
    window.addEventListener('wheel', savePosition, { passive: true })

    createOrbitControlsGizmo(refs.debugRoot, controls)

  /**
   * No controls
   */
  } else {
    save('three-inspect.camera', null)
    save('controls', null)
  }
}
