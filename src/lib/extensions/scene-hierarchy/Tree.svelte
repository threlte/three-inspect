<script lang="ts">
	import { useThrelte, watch } from '@threlte/core'
	import { TreeViewItem, TreeViewWebComponent } from 'flexible-tree'
	import type * as THREE from 'three'
	import { useOnAdd } from '../../hooks/useOnAdd'
	import { useOnRemove } from '../../hooks/useOnRemove'
	import { useObjectSelection } from '../object-selection/useObjectSelection'

	const treeview = new TreeViewWebComponent()
	treeview.scrollable = true
	treeview.allowRenaming = false
	treeview.dom.style.cssText = `
  font-family: monospace;
  font-size: 11px;
  height: 280px;
  `

	const { scene } = useThrelte()
	const { selectedObjects, removeFromSelection, addToSelection } = useObjectSelection()

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

		if ($selectedObjects.includes(object)) {
			removeFromSelection([object])
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
		item.selected = $selectedObjects.includes(object)
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
		addToSelection([object])
	}

	treeview.on('deselect', (item: TreeViewItem) => {
		if (!observeChanges) return
		selectedItems.delete(item)
		const object = treeItemToObject.get(item)
		if (!object) return
		removeFromSelection([object])
	})

	treeview.on('select', handleSelect)

	useOnAdd((object) => {
		register(object)
	})

	useOnRemove((object) => {
		deregister(object)
	})

	for (const child of scene.children) {
		register(child)
	}

	const noUndef = <T,>(v: T | undefined): v is T => v !== undefined

	watch(selectedObjects, (objects) => {
		observeChanges = false

		const treeItems = objects
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
