import * as THREE from 'three'
import { Pane, addFolder, deleteFolder, state } from '../pane'
import { removeUpdate, update } from '../update'

const vec3 = new THREE.Vector3()
const scale = new THREE.Vector3()
const quat = new THREE.Quaternion()
const mat4 = new THREE.Matrix4()

const quatSettings = {
  expanded: true,
  picker: 'inline',
  view: 'rotation',
}

export const addTransformInputs = (pane: Pane, object3D: THREE.Object3D) => {
  const { quaternion } = object3D

  const params = {
    quaternion: new THREE.Quaternion(),
  }

  const quaternionChange = () => {
    if (state.controlling) {
      quaternion.copy(params.quaternion)
    }
  }

  const posInput = pane.addInput(object3D, 'position', { step: 0.1 })
  const rotInput = pane.addInput(params, 'quaternion', quatSettings)
    .on('change', quaternionChange)

  const handleTransformUpdate = () => {
    if (pane.expanded && !state.controlling) {
      params.quaternion.copy(quaternion)
      rotInput.refresh()
      posInput.refresh()
    }
  }

  update(handleTransformUpdate)

  let imeshDispose: (() => void) | undefined

  if (object3D instanceof THREE.InstancedMesh) {
    const imeshFolder = addFolder(pane, 'instances')

    const imeshParams = {
      index: 0,
      position: new THREE.Vector3(),
      quaternion: new THREE.Quaternion(),
    }

    const imeshIndex = imeshFolder.addInput(imeshParams, 'index', {
      max: object3D.count - 1,
      min: 0,
      step: 1,
    })
    const imeshPos = imeshFolder.addInput(imeshParams, 'position')
    const imeshRot = imeshFolder.addInput(imeshParams, 'quaternion', quatSettings)

    const instanceIndexChange = () => {
      object3D.getMatrixAt(imeshParams.index, mat4)
      mat4.decompose(vec3, quat, scale)
      imeshParams.position.copy(vec3)
      imeshParams.quaternion.copy(quat)
      imeshPos.refresh()
      imeshRot.refresh()
    }

    const instanceChange = () => {
      quat.copy(imeshParams.quaternion)
      vec3.copy(imeshParams.position)
      mat4.makeRotationFromQuaternion(quat)
      mat4.setPosition(vec3)
      object3D.setMatrixAt(imeshParams.index, mat4)
      object3D.instanceMatrix.needsUpdate = true
    }

    imeshIndex.on('change', instanceIndexChange)
    imeshPos.on('change', instanceChange)
    imeshRot.on('change', instanceChange)

    const handleInstancedMeshUpdate = () => {
      if (imeshFolder.expanded && !state.controlling) {
        imeshParams.quaternion.copy(quaternion)
        imeshPos.refresh()
        imeshRot.refresh()
      }
    }

    update(handleInstancedMeshUpdate)

    imeshDispose = () => {
      deleteFolder(imeshFolder)
      removeUpdate(handleInstancedMeshUpdate)
    }
  }

  const dispose = () => {
    posInput.dispose()
    rotInput.dispose()

    removeUpdate(handleTransformUpdate)

    imeshDispose?.()
  }

  return dispose
}
