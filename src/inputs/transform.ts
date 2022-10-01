import { Pane, addFolder, state } from '../pane'
import { createM4, createQuat, createVec3 } from '../lib/math'
import { removeUpdate, update } from '../update'

const quatSettings = {
  expanded: true,
  picker: 'inline',
  view: 'rotation',
}

const vec3 = createVec3()
const quat = createQuat()
const m4 = createM4()

const addInstancedMeshFolder = (folder: Pane, mesh: THREE.InstancedMesh) => {
  const meshFolder = addFolder(folder, 'instances')

  const imeshParams = {
    index: 0,
    position: createVec3(),
    quaternion: createQuat(),
  }

  const imeshIndex = meshFolder.addInput(imeshParams, 'index', {
    max: mesh.count - 1,
    min: 0,
    step: 1,
  })
  const imeshPos = meshFolder.addInput(imeshParams, 'position')
  const imeshRot = meshFolder.addInput(imeshParams, 'quaternion', quatSettings)

  const instanceIndexChange = () => {
    mesh.getMatrixAt(imeshParams.index, m4)
    vec3.setFromMatrixPosition(m4)
    quat.setFromRotationMatrix(m4)
    imeshParams.position.copy(vec3)
    imeshParams.quaternion.copy(quat)
    imeshPos.refresh()
    imeshRot.refresh()
  }

  const instanceChange = () => {
    quat.copy(imeshParams.quaternion)
    vec3.copy(imeshParams.position)
    m4.makeRotationFromQuaternion(quat)
    m4.setPosition(vec3)
    mesh.setMatrixAt(imeshParams.index, m4)
    mesh.instanceMatrix.needsUpdate = true
  }

  imeshIndex.on('change', instanceIndexChange)
  imeshPos.on('change', instanceChange)
  imeshRot.on('change', instanceChange)

  const handleInstancedMeshUpdate = () => {
    if (meshFolder.expanded && !state.controlling) {
      imeshParams.quaternion.copy(mesh.quaternion)
      imeshPos.refresh()
      imeshRot.refresh()
    }
  }

  update(handleInstancedMeshUpdate)

  return () => {
    removeUpdate(handleInstancedMeshUpdate)
  }
}

export const addTransformInputs = (pane: Pane, object3D: THREE.Object3D) => {
  const instancedMesh = object3D as THREE.InstancedMesh

  const params = {
    quaternion: createQuat(),
  }

  const quaternionChange = () => {
    if (state.controlling) {
      object3D.quaternion.copy(params.quaternion)
    }
  }

  const posInput = pane.addInput(object3D, 'position', { step: 0.1 })
  const rotInput = pane.addInput(params, 'quaternion', quatSettings)
    .on('change', quaternionChange)

  const handleTransformUpdate = () => {
    if (pane.expanded && !state.controlling) {
      params.quaternion.copy(object3D.quaternion)
      rotInput.refresh()
      posInput.refresh()
    }
  }

  update(handleTransformUpdate)

  let imeshDispose: (() => void) | undefined

  if (instancedMesh.isInstancedMesh) {
    imeshDispose = addInstancedMeshFolder(pane, instancedMesh)
  }

  return () => {
    removeUpdate(handleTransformUpdate)
    imeshDispose?.()
  }
}
