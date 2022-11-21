import { dispatcher } from './event-dispatcher'
import { refs } from '../refs'

export const mouseRaycaster = (onSelect: (intersects: THREE.Intersection[]) => void) => {
  const { THREE, renderer } = refs
  const canvas = renderer.domElement
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()

  const onPointerDown = (event: MouseEvent) => {
    const { scene, camera } = refs
    /*
     * Calculate pointer position in normalized device coordinates
     * (-1 to +1) for both components
     */
    pointer.x = ((event.clientX / canvas.clientWidth) * 2) - 1
    pointer.y = -((event.clientY / canvas.clientHeight) * 2) + 1

    // Update the picking ray with the camera and pointer position
    raycaster.setFromCamera(pointer, camera)

    const intersections = raycaster.intersectObjects(scene.children).filter((intersection) => {
      return intersection.object.userData.THREE_INSPECT_OMIT !== true
    })

    onSelect(intersections)
  }

  dispatcher.addEventListener('enable-select', (event) => {
    if ((event as { enabled: boolean }).enabled) {
      canvas.addEventListener('pointerdown', onPointerDown, { passive: true })
    } else {
      canvas.removeEventListener('pointerdown', onPointerDown)
    }
  })
}
