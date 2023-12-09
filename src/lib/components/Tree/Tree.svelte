<script lang='ts'>
  import * as THREE from 'three'
  import { onMount, tick } from 'svelte'
  import { useThrelte } from '@threlte/core'
  import { TreeViewItem, TreeViewWebComponent } from 'flexible-tree'
  import { useOnAdd } from '$lib/hooks/useOnAdd'
  import { useOnRemove } from '$lib/hooks/useOnRemove'
  import { getInternalContext } from '../../internal/context'
  
  const treeview = new TreeViewWebComponent()
  treeview.scrollable = true
  treeview.allowRenaming = false
  treeview.dom.style.cssText = `
  font-family: monospace;
  font-size: 11px;
  height: 280px;
  `
  
  let element: HTMLElement
  
  const { scene } = useThrelte()
  const { selectedObject } = getInternalContext()
  
  const treeroot = new TreeViewItem({ text: 'Scene' })
  treeview.append(treeroot)
  
  const objectToTreeItem = new WeakMap<THREE.Object3D, TreeViewItem>()
  const treeItemToObject = new WeakMap<TreeViewItem, THREE.Object3D>()
  
  treeItemToObject.set(treeroot, scene)
  
  const getObjectType = (object3D: THREE.Object3D) => {
    if ('isInstancedMesh' in object3D) {
      return 'InstancedMesh'
    }
  
    if ((object3D as unknown as { geometry: { isMeshLine: boolean }}).geometry?.isMeshLine) {
      return 'MeshLine'
    }
  
    return object3D.type
  }
  
  const deregister = (object3D: THREE.Object3D) => {
    object3D.traverse((child) => object3D !== child && deregister(child))
  
    const item = objectToTreeItem.get(object3D)
    objectToTreeItem.delete(object3D)
  
    if (object3D === $selectedObject) {
      selectedObject.set(undefined)
    }
  
    // @TODO investigate
    if (item !== undefined) {
      treeItemToObject.delete(item)
      item.destroy()
    }
  }
  
  const orphaned = new Map()
  
  const register = (object3D: THREE.Object3D) => {
    const { parent } = object3D
    const name = object3D.name
    const parentItem = parent instanceof THREE.Scene ? treeroot : objectToTreeItem.get(parent!)
    const text = `${name ? `${name} ` : ''}(${getObjectType(object3D)})`
    const item = new TreeViewItem({ text })
    item.open = true
    item.selected = object3D === $selectedObject
    objectToTreeItem.set(object3D, item)
    treeItemToObject.set(item, object3D)
  
    if (parentItem) {
      parentItem.append(item)
    } else if (object3D.parent) {
      orphaned.set(object3D.parent.uuid, item)
    }
  
    const orphan = orphaned.get(object3D.uuid)
  
    if (orphan && !orphan._destroyed) {
      item.append(orphan)
      orphaned.delete(object3D.uuid)
    }
  
    object3D.children.forEach((child) => register(child))
  }
  
  treeview.on('deselect', () => {
    selectedObject.set(undefined)
  })

  treeview.on('select', async (item: TreeViewItem) => {
    selectedObject.set(undefined)
    await tick()
    selectedObject.set(treeItemToObject.get(item))
  })
  
  useOnAdd((object) => register(object))
  useOnRemove((object) => deregister(object))
  
  scene.children.forEach((child) => register(child))
  
  onMount(() => {
    element.replaceWith(treeview.wc)
  })
</script>

<div bind:this={element} />
