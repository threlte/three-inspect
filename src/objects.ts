import { TreeViewItem } from 'flexible-tree'

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
  return treeItemToObject.get(item)
}

export const treeItemFromObject = (object: THREE.Object3D) => {
  return objectToTreeItem.get(object)
}

export const deregister = (object3D: THREE.Object3D) => {
  if (object3D.userData.THREE_INSPECT_OMIT === true) {
    return
  }

  object3D.traverse((child) => object3D !== child && deregister(child))

  const item = objectToTreeItem.get(object3D)
  objectToTreeItem.delete(object3D)

  // @TODO investigate
  if (item !== undefined) {
    treeItemToObject.delete(item)
    item.destroy()
  }
}

const orphaned = new Map()

export const register = (treeroot: TreeViewItem, object3D: THREE.Object3D, parent: THREE.Object3D) => {
  if (object3D.userData.THREE_INSPECT_OMIT === true) {
    return
  }

  const name = object3D.name
  const parentItem = 'isScene' in parent ? treeroot : objectToTreeItem.get(parent)
  const text = `${name ? `${name} ` : ''}(${getObjectType(object3D)})`
  const item = new TreeViewItem({ text })
  item.open = true
  objectToTreeItem.set(object3D, item)
  treeItemToObject.set(item, object3D)

  if (parentItem) {
    parentItem.append(item)
  } else if (object3D.parent) {
    orphaned.set(object3D.parent.uuid, item)
  }

  const orphan = orphaned.get(object3D.uuid)
  if (orphan) {
    item.append(orphan)
    orphaned.delete(object3D.uuid)
  }

  {
    const { children } = object3D

    for (let i = 0, l = children.length; i < l; i += 1) {
      register(treeroot, children[i], object3D)
    }
  }
}
