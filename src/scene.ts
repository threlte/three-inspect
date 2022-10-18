import { type Cameras, addCameraInputs } from './inputs/camera'
import { deregister, getFromTreeItem, register } from './objects'
import type { EffectComposer } from 'postprocessing'
import type TreeView from './treeview'
import type { TreeViewItem } from './treeview/item'
import { addLightInputs } from './inputs/lights'
import { addObjectInputs } from './inputs/object3d'
import { addSceneInputs } from './folders/scene'
import { createPane } from './pane'
import { patchObject3d } from './patch/object3d'

type Disposer = () => void

const handleSelectItem = (root: HTMLElement, object3D: THREE.Object3D, renderer: THREE.WebGLRenderer, composer?: EffectComposer) => {
  const pane = createPane(root)

  let disposeInputs: Disposer

  if ('isPerspectiveCamera' in object3D || 'isOrthographicCamera' in object3D) {
    disposeInputs = addCameraInputs(pane, object3D as Cameras, renderer, composer)
  } else if ('isScene' in object3D) {
    disposeInputs = addSceneInputs(pane, object3D as THREE.Scene, renderer)
  } else if ('isLight' in object3D) {
    disposeInputs = addLightInputs(pane, object3D as THREE.Light)
  } else {
    disposeInputs = addObjectInputs(pane, object3D)
  }

  return () => {
    disposeInputs()
    pane.dispose()
  }
}

export const initScene = (
  tree: TreeView,
  treeroot: TreeViewItem,
  root: HTMLElement,
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  composer?: EffectComposer
) => {
  const disposePatcher = patchObject3d(treeroot)

  let disposer: null | (() => void) = null

  tree.on('deselect', () => {
    disposer?.()
    disposer = null
  })

  tree.on('select', (item: TreeViewItem) => {
    disposer = handleSelectItem(
      root,
      item.text === 'Scene' ? scene : getFromTreeItem(item),
      renderer,
      composer
    )
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
