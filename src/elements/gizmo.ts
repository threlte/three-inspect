import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OrbitControlsGizmo } from 'trzy'
import { refs } from '../refs'

export const createOrbitControlsGizmo = (el: HTMLElement, controls: OrbitControls) => {
  const { camera } = refs
  const gizmo = new OrbitControlsGizmo({ camera, controls, el })
  return () => gizmo.dispose()
}
