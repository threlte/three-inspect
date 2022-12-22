import { deregister, register } from '../objects'
import type { TreeViewItem } from 'flexible-tree'
import { refs } from '../refs'

export const patchObject3d = (treeroot: TreeViewItem) => {
  const { THREE } = refs
  const add = THREE.Object3D.prototype.add
  const remove = THREE.Object3D.prototype.remove
  const clear = THREE.Object3D.prototype.clear

  THREE.Object3D.prototype.add = function (...object: THREE.Object3D[]) {
    add.call(this, ...object)

    for (let i = 0, l = object.length; i < l; i += 1) {
      register(treeroot, object[i], this)
    }

    return this
  }

  THREE.Object3D.prototype.remove = function (...object: THREE.Object3D[]) {
    remove.call(this, ...object)

    for (let i = 0, l = object.length; i < l; i += 1) {
      deregister(object[i])
    }

    return this
  }

  THREE.Object3D.prototype.clear = function () {
    const { children } = this

    clear.call(this)

    for (let i = 0, l = children.length; i < l; i += 1) {
      deregister(children[i])
    }

    return this
  }

  return () => {
    THREE.Object3D.prototype.add = add
    THREE.Object3D.prototype.remove = remove
    THREE.Object3D.prototype.clear = clear
  }
}
