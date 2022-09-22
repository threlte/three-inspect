import * as THREE from 'three'

export const disposeHelper = (helper?: THREE.Line) => {
  if (helper === undefined) {
    return
  }

  helper.geometry.dispose()

  if (helper.material instanceof THREE.Material) {
    helper.material.dispose()
  }
}