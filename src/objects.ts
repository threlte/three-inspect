import { addForwardHelperInput } from './inputs/helper-forward'
import { addMaterialInputs } from './inputs/material'
import { addTransformInputs } from './inputs/transform'
import { pane } from './pane'

export const objectFolder = pane.addFolder({ title: 'Objects' })

type Disposer = () => void

const disposers = new WeakMap<THREE.Object3D, Disposer>()

export const deregister = (object: THREE.Object3D) => {
  disposers.get(object)?.()
  disposers.delete(object)
}

export const register = (object3D: THREE.Object3D, mainFolder = objectFolder) => {
  const isInstanced = (object3D as THREE.InstancedMesh).isInstancedMesh
  const instancedFlag = isInstanced ? ' (instanced)' : ''
  const title = `${object3D.name || '[unnamed]'}${instancedFlag}`
  const folder = mainFolder.addFolder({ index: object3D.id, title })
  folder.addInput(object3D, 'castShadow')
  folder.addInput(object3D, 'receiveShadow')
  folder.addInput(object3D, 'frustumCulled')
  folder.addInput(object3D, 'visible')

  let disposeForwardHelper: (() => void) | undefined
  if (!object3D.type.toLowerCase().includes('helper')) {
    disposeForwardHelper = addForwardHelperInput(folder, object3D)
  }
  const disposeTransformInputs = addTransformInputs(folder, object3D)

  let disposeMaterialInputs: (() => void) | undefined
  if ((object3D as THREE.Mesh).isMesh) {
    disposeMaterialInputs = addMaterialInputs(folder, object3D as THREE.Mesh)
  }

  const childrenFolder = folder.addFolder({ index: object3D.id, title: 'Children' })
  childrenFolder.hidden = true

  const add = object3D.add.bind(object3D)
  const remove = object3D.remove.bind(object3D)

  object3D.add = (...args) => {
    childrenFolder.hidden = false
    for (const child of args) {
      register(child, childrenFolder)
    }

    return add(...args)
  }

  object3D.remove = (...args) => {
    for (const child of args) {
      deregister(child)
    }
    return remove(...args)
  }

  if (object3D.children.length > 0) {
    childrenFolder.hidden = false
    for (const child of object3D.children) {
      register(child, childrenFolder)
    }
  }

  disposers.set(object3D, () => {
    disposeMaterialInputs?.()
    disposeTransformInputs()
    disposeForwardHelper?.()
    object3D.traverse((child) => object3D !== child && deregister(child))
    folder.dispose()
  })
}
