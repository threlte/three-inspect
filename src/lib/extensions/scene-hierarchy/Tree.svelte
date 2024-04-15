<script lang="ts">
	import { useThrelte } from '@threlte/core'
	import { TreeViewItem, TreeViewWebComponent } from 'flexible-tree'
	import type * as THREE from 'three'
	import { useOnAdd } from '../../hooks/useOnAdd'
	import { useOnRemove } from '../../hooks/useOnRemove'
	import { useObjectSelection } from '../object-selection/useObjectSelection.svelte'
	import { tick } from 'svelte'
	import { useStudioObjectsRegistry } from '../studio-objects-registry/useStudioObjectsRegistry.svelte'

	const treeview = new TreeViewWebComponent()
	treeview.scrollable = true
	treeview.allowRenaming = false
	treeview.dom.style.cssText = `
  font-family: monospace;
  font-size: 11px;
  height: 280px;
  `

	const { scene } = useThrelte()
	const objectSelection = useObjectSelection()
	const studioObjectsRegistry = useStudioObjectsRegistry()

	const treeroot = new TreeViewItem({ text: 'Scene' })
	treeview.append(treeroot)

	const objectToTreeItem = new WeakMap<THREE.Object3D, TreeViewItem>()
	const treeItemToObject = new WeakMap<TreeViewItem, THREE.Object3D>()
	const selectedItems = new Set<TreeViewItem>()

	treeItemToObject.set(treeroot, scene)
	objectToTreeItem.set(scene, treeroot)

	const deregister = (object: THREE.Object3D) => {
		object.traverse((child) => {
			if (object !== child) {
				deregister(child)
			}
		})

		const item = objectToTreeItem.get(object)
		objectToTreeItem.delete(object)

		if (objectSelection.selectedObjects.includes(object)) {
			objectSelection.removeFromSelection([object])
		}

		// @TODO investigate
		if (item !== undefined) {
			treeItemToObject.delete(item)
			item.destroy()
		}
	}

	const orphaned = new Map()

	let observeChanges = true

	const register = (object: THREE.Object3D) => {
		const { parent } = object
		const name = object.name
		const parentItem = parent === scene ? treeroot : objectToTreeItem.get(parent!)
		const text = `${name ? `${name} ` : ''}(${object.type})`
		const item = new TreeViewItem({ text })
		item.open = true
		item.selected = objectSelection.selectedObjects.includes(object)
		// item.selected = object3D === $selectedObject
		objectToTreeItem.set(object, item)
		treeItemToObject.set(item, object)

		if (parentItem) {
			parentItem.append(item)
		} else if (object.parent) {
			orphaned.set(object.parent.uuid, item)
		}

		const orphan = orphaned.get(object.uuid)

		if (orphan && !orphan._destroyed) {
			item.append(orphan)
			orphaned.delete(object.uuid)
		}

		for (const child of object.children) {
			register(child)
		}
	}

	const handleSelect = async (item: TreeViewItem) => {
		if (!observeChanges) return
		selectedItems.add(item)
		const object = treeItemToObject.get(item)
		if (!object) return
		objectSelection.addToSelection([object])
	}

	treeview.on('deselect', (item: TreeViewItem) => {
		if (!observeChanges) return
		selectedItems.delete(item)
		const object = treeItemToObject.get(item)
		if (!object) return
		objectSelection.removeFromSelection([object])
	})

	treeview.on('select', handleSelect)

	useOnAdd(async (object) => {
		await tick()
		if (studioObjectsRegistry.isOrIsChildOfStudioObject(object)) return
		register(object)
	})

	useOnRemove(async (object) => {
		await tick()
		if (studioObjectsRegistry.isOrIsChildOfStudioObject(object)) return
		deregister(object)
	})

	for (const child of scene.children) {
		register(child)
	}

	const noUndef = <T,>(v: T | undefined): v is T => v !== undefined

	$effect(() => {
		observeChanges = false

		const treeItems = objectSelection.selectedObjects
			.map((object) => {
				const treeitem = objectToTreeItem.get(object)
				return treeitem
			})
			.filter(noUndef)

		treeItems.forEach((treeitem) => {
			treeitem.selected = true
		})

		observeChanges = true
		return () => {
			observeChanges = false
			treeItems.forEach((treeitem) => {
				treeitem.selected = false
			})
			observeChanges = true
		}
	})

	const replace = (node: HTMLElement) => {
		node.replaceWith(treeview.wc)
		return {
			destroy() {
				treeview.wc.replaceWith(node)
			},
		}
	}
</script>

<div use:replace />
