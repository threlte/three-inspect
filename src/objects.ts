import { TreeViewItem } from './treeview/item'

const objectToTreeItem = new WeakMap<THREE.Object3D, TreeViewItem>()
const treeItemToObject = new WeakMap<TreeViewItem, THREE.Object3D>()

const getObjectType = (object3D: THREE.Object3D) => {
  if ('isInstancedMesh' in object3D) {
    return 'InstancedMesh'
  }

  // @ts-expect-error Need to type meshline
  if ((object3D).geometry?.isMeshLine) {
    return 'MeshLine'
  }

  return object3D.type
}

export const objectFromTreeItem = (item: TreeViewItem) => {
  return treeItemToObject.get(item)!
}

export const deregister = (object3D: THREE.Object3D) => {
  if (object3D.userData.threeDebugOmit === true) {
    return
  }

  object3D.traverse((child) => object3D !== child && deregister(child))

  const item = objectToTreeItem.get(object3D)!
  item.destroy()
  objectToTreeItem.delete(object3D)
  treeItemToObject.delete(item)
}

export const register = (treeroot: TreeViewItem, object3D: THREE.Object3D, parent: THREE.Object3D) => {
  if (object3D.userData.threeDebugOmit === true) {
    return
  }

  const parentItem = 'isScene' in parent ? treeroot : objectToTreeItem.get(parent)

  if (parentItem === undefined) {
    return
  }

  const text = `${object3D.name} (${getObjectType(object3D)})`
  const item = new TreeViewItem({ text })
  item.open = true
  objectToTreeItem.set(object3D, item)
  treeItemToObject.set(item, object3D)
  parentItem.append(item)

  {
    const { children } = object3D

    for (let i = 0, l = children.length; i < l; i += 1) {
      register(treeroot, children[i], object3D)
    }
  }
}
