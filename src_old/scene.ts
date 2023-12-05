import { type Cameras, addCameraInputs } from './inputs/camera'
import type { TreeView, TreeViewItem } from 'flexible-tree'
import { deregister, objectFromTreeItem, register, treeItemFromObject } from './objects'
import { addLightInputs } from './inputs/lights'
import { addObjectInputs } from './inputs/object3d'
import { addSceneInputs } from './folders/scene'
import { createPane } from './pane'
import { mouseRaycaster } from './lib/raycast'
import { patchObject3d } from './patch/object3d'
import { refs } from './refs'
import { save } from 'trzy'

type Disposer = () => void

const handleSelectItem = (root: HTMLElement, object3D: THREE.Object3D) => {
  if (object3D.name) {
    save('three-inspect.selected', object3D.name)
  }

  const pane = createPane(root)

  let disposers: Disposer[]

  if ('isPerspectiveCamera' in object3D || 'isOrthographicCamera' in object3D) {
    disposers = addCameraInputs(pane, object3D as Cameras)
  } else if ('isScene' in object3D) {
    disposers = addSceneInputs(pane)
  } else if ('isLight' in object3D) {
    disposers = addLightInputs(pane, object3D as THREE.Light)
  } else {
    disposers = addObjectInputs(pane, object3D)
  }

  return () => {
    disposers.forEach((disposer) => disposer())
    pane.dispose()
  }
}

export const initScene = (
  tree: TreeView,
  treeroot: TreeViewItem,
  root: HTMLElement
) => {
  const { scene } = refs
  const disposePatcher = patchObject3d(treeroot)

  let selected: TreeViewItem | undefined

  mouseRaycaster((intersects) => {
    if (intersects.length < 1) {
      return
    }

    let treeItem: TreeViewItem | undefined


    while (treeItem === undefined) {
      const intersect = intersects.shift()

      if (intersect === undefined) {
        break
      }

      treeItem = treeItemFromObject(intersect.object)
    }

    if (treeItem !== undefined) {
      if (selected !== undefined) {
        selected.selected = false
      }
      treeItem.selected = true
      treeItem.dom.scrollIntoView()
    }
  })

  let disposer: null | (() => void) = null

  tree.on('deselect', () => {
    disposer?.()
    disposer = null
    selected = undefined
  })

  tree.on('select', (item: TreeViewItem) => {
    disposer?.()
    disposer = null
    selected = item

    const object3D = item.text === 'Scene' ? scene : objectFromTreeItem(item)

    if (object3D !== undefined) {
      disposer = handleSelectItem(root, object3D)
    }
  })

  tree.on('reparent', (items: { item: TreeViewItem, newParent: TreeViewItem }[]) => {
    for (let i = 0, l = items.length; i < l; i += 1) {
      const { item, newParent } = items[i]
      const child = objectFromTreeItem(item)
      const parent = newParent.text === 'Scene' ? scene : objectFromTreeItem(newParent)

      if (parent !== undefined && child !== undefined) {
        parent.attach(child)
      }
    }
  })

  {
    const { children } = scene
    for (let i = 0, l = children.length; i < l; i += 1) {
      register(treeroot, children[i], scene)
    }
  }

  const deregisterAll = () => {
    const { children } = scene

    for (let i = 0, l = children.length; i < l; i += 1) {
      deregister(children[i])
    }
  }

  return () => {
    disposePatcher()
    tree.clearTreeItems()
    deregisterAll()
  }
}
