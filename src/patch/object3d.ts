import { deregister, register } from '../objects'
import type { TreeViewItem } from '../treeview/item'
import { three } from '../three'

export const patchObject3d = (treeroot: TreeViewItem) => {
  const THREE = three()
  const add = THREE.Object3D.prototype.add
  const remove = THREE.Object3D.prototype.remove
  const clear = THREE.Object3D.prototype.clear

  THREE.Object3D.prototype.add = function (...object: THREE.Object3D[]) {
    for (let i = 0, l = object.length; i < l; i += 1) {
      register(treeroot, object[i], this)
    }

    add.call(this, ...object)

    return this
  }

  THREE.Object3D.prototype.remove = function (...object: THREE.Object3D[]) {
    for (let i = 0, l = object.length; i < l; i += 1) {
      deregister(object[i])
    }

    remove.call(this, ...object)

    return this
  }

  THREE.Object3D.prototype.clear = function () {
    const { children } = this

    for (let i = 0, l = children.length; i < l; i += 1) {
      deregister(children[i])
    }

    clear.call(this)

    return this
  }

  return () => {
    THREE.Object3D.prototype.add = add
    THREE.Object3D.prototype.remove = remove
    THREE.Object3D.prototype.clear = clear
  }
}
