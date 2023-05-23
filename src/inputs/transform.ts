import * as THREE from 'three'
import { removeUpdate, update } from '../update'
import type { Pane } from '../pane'

const state = {
  controlling: false,
}

const rotationSettings = {
  expanded: false,
  picker: 'inline',
  rotationMode: 'euler',
  view: 'rotation',
}

const addInstancedMeshInputs = (pane: Pane, mesh: THREE.InstancedMesh) => {
  const m4 = new THREE.Matrix4()

  pane.addSeparator()

  const params = {
    index: 0,
    position: new THREE.Vector3(),
    rotation: new THREE.Euler(),
    scale: new THREE.Vector3(),
  }

  const index = pane.addInput(params, 'index', {
    label: 'instance index',
    max: mesh.count - 1,
    min: 0,
    step: 1,
  })
  const pos = pane.addInput(params, 'position', { index: 0 })
  const rot = pane.addInput(params, 'rotation', rotationSettings)
  const scale = pane.addInput(params, 'scale', { index: 0 })

  const instanceIndexChange = () => {
    mesh.getMatrixAt(params.index, m4)
    params.position.setFromMatrixPosition(m4)
    params.rotation.setFromRotationMatrix(m4)
    params.scale.setFromMatrixScale(m4)
    pos.refresh()
    rot.refresh()
    scale.refresh()
  }

  const instanceChange = () => {
    m4.makeRotationFromEuler(params.rotation)
    m4.setPosition(params.position)
    m4.scale(params.scale)
    mesh.setMatrixAt(params.index, m4)
    mesh.instanceMatrix.needsUpdate = true
  }

  index.on('change', instanceIndexChange)
  pos.on('change', instanceChange)
  rot.on('change', instanceChange)
  scale.on('change', instanceChange)

  const handleInstancedMeshUpdate = () => {
    if (!state.controlling) {
      instanceIndexChange()
    }
  }

  update(handleInstancedMeshUpdate)

  return () => removeUpdate(handleInstancedMeshUpdate)
}

export const addTransformInputs = (pane: Pane, object3D: THREE.Object3D) => {
  const { element } = pane

  const params = {
    rotation: new THREE.Euler(),
  }

  const rotationChange = () => {
    if (state.controlling) {
      object3D.rotation.copy(params.rotation)
    }
  }

  pane.addSeparator()
  const posInput = pane.addInput(object3D, 'position', { step: 0.1 })
  const rotInput = pane.addInput(params, 'rotation', rotationSettings)
    .on('change', rotationChange)
  const scaleInput = pane.addInput(object3D, 'scale', { step: 0.1 })

  const handleTransformUpdate = () => {
    if (state.controlling) {
      return
    }

    if (!object3D.rotation.equals(params.rotation)) {
      params.rotation.copy(object3D.rotation)
      rotInput.refresh()
    }

    posInput.refresh()
    scaleInput.refresh()
  }

  update(handleTransformUpdate)

  let imeshDispose: (() => void) | undefined

  if ('isInstancedMesh' in object3D) {
    imeshDispose = addInstancedMeshInputs(pane, object3D as THREE.InstancedMesh)
  }

  const handleDown = () => {
    state.controlling = true
  }

  const handleUp = () => {
    state.controlling = false
  }

  element.addEventListener('mousedown', handleDown, { passive: true })
  element.addEventListener('mouseup', handleUp, { passive: true })

  return () => {
    element.removeEventListener('mousedown', handleDown)
    element.removeEventListener('mouseup', handleUp)

    posInput.dispose()
    rotInput.dispose()
    scaleInput.dispose()
    removeUpdate(handleTransformUpdate)
    imeshDispose?.()
  }
}
