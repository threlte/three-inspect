import { addForwardHelperInput } from './inputs/helper-forward'
import { addMaterialInputs } from './inputs/material'
import { addTransformInputs } from './inputs/transform'
import { pane } from './pane'

export const objectFolder = pane.addFolder({ title: 'objects' })

type Disposer = () => void

const disposers = new WeakMap<THREE.Object3D, Disposer>()

export const deregister = (object: THREE.Object3D) => {
  disposers.get(object)?.()
  disposers.delete(object)
}

export const register = (object: THREE.Object3D, mainFolder = objectFolder) => {
  const isInstanced = (object as THREE.InstancedMesh).isInstancedMesh
  const instancedFlag = isInstanced ? ' (instanced)' : ''
  const title = `#${object.id} ${object.name || '[unnamed]'}${instancedFlag}`
  const folder = mainFolder.addFolder({ title })
  folder.addInput(object, 'castShadow')
  folder.addInput(object, 'receiveShadow')
  folder.addInput(object, 'frustumCulled')
  folder.addInput(object, 'visible')

  let disposeForwardHelper: (() => void) | undefined
  if (!object.type.toLowerCase().includes('helper')) {
    disposeForwardHelper = addForwardHelperInput(folder, object)
  }
  const disposeTransformInputs = addTransformInputs(folder, object)

  let disposeMaterialInputs: (() => void) | undefined
  if ((object as THREE.Mesh).isMesh) {
    disposeMaterialInputs = addMaterialInputs(folder, object as THREE.Mesh)
  }

  const childrenFolder = folder.addFolder({ title: 'children' })
  childrenFolder.hidden = true

  const add = object.add.bind(object)
  const remove = object.remove.bind(object)

  object.add = (...args) => {
    childrenFolder.hidden = false
    for (const child of args) {
      register(child, childrenFolder)
    }

    return add(...args)
  }

  object.remove = (...args) => {
    for (const child of args) {
      deregister(child)
    }
    return remove(...args)
  }

  if (object.children.length > 0) {
    childrenFolder.hidden = false
    for (const child of object.children) {
      register(child, childrenFolder)
    }
  }

  disposers.set(object, () => {
    disposeMaterialInputs?.()
    disposeTransformInputs()
    disposeForwardHelper?.()
    object.traverse((child) => object !== child && deregister(child))
    folder.dispose()
  })
}
