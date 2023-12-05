import * as THREE from 'three'
import type { Pane } from '../pane'
import { addForwardHelperInput } from './helper-forward'
import { addMaterialInputs } from './material'
import { addTransformInputs } from './transform'
import { addUserdataInput } from './userdata'

type Disposer = () => void

export const addObjectInputs = (pane: Pane, object3D: THREE.Object3D) => {
  if (object3D instanceof THREE.Points) {
    pane.addMonitor(object3D.geometry.attributes.position, 'count')
  }

  pane.addInput(object3D, 'castShadow')
  pane.addInput(object3D, 'receiveShadow')
  pane.addInput(object3D, 'frustumCulled')
  pane.addInput(object3D, 'matrixAutoUpdate')
  pane.addInput(object3D, 'visible')

  const disposers: Disposer[] = []

  if (!object3D.type.toLowerCase().includes('helper')) {
    disposers.push(addForwardHelperInput(pane, object3D))
  }

  disposers.push(addTransformInputs(pane, object3D))

  const mesh = object3D as THREE.Mesh

  if (Array.isArray(mesh.material)) {
    for (let i = 0, l = mesh.material.length; i < l; i += 1) {
      if (mesh.material[i] instanceof THREE.Material) {
        disposers.push(addMaterialInputs(pane, mesh))
      }
    }
  } else if (mesh.material !== undefined && mesh.material instanceof THREE.Material) {
    disposers.push(addMaterialInputs(pane, mesh))
  }

  disposers.push(addUserdataInput(pane, object3D))

  return disposers
}
