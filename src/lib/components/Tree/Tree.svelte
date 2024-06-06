<script lang="ts">
	import type { Object3D } from 'three'
	import { onMount } from 'svelte'
	import { useThrelte, watch } from '@threlte/core'
	import { TreeViewItem, TreeViewWebComponent } from 'flexible-tree'
	import { useOnAdd } from '../../hooks/useOnAdd'
	import { useOnRemove } from '../../hooks/useOnRemove'
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

	const objectToTreeItem = new WeakMap<Object3D, TreeViewItem>()
	const treeItemToObject = new WeakMap<TreeViewItem, Object3D>()

	treeItemToObject.set(treeroot, scene)

	const deregister = (object3D: Object3D) => {
		object3D.traverse((child) => {
			if (object3D !== child) {
				deregister(child)
			}
		})

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

	let observeChanges = true

	const register = (object3D: Object3D) => {
		const { parent } = object3D
		const name = object3D.name
		const parentItem =
			parent === scene ? treeroot : objectToTreeItem.get(parent!)
		const text = `${name ? `${name} ` : ''}(${object3D.type})`
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

		for (const child of object3D.children) {
			register(child)
		}
	}

	const handleSelect = (item: TreeViewItem) => {
		if (!observeChanges) return
		selectedObject.set(treeItemToObject.get(item))
	}

	treeview.on('deselect', () => {
		if (!observeChanges) return
		selectedObject.set(undefined)
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

	watch(selectedObject, (object) => {
		observeChanges = false

		if (object) {
			const treeitem = objectToTreeItem.get(object)

			if (treeitem) treeitem.selected = true
			observeChanges = true

			return () => {
				if (treeitem) {
					observeChanges = false
					treeitem.selected = false
					observeChanges = true
				}
			}
		}

		observeChanges = true
		return () => {}
	})

	onMount(() => {
		element.replaceWith(treeview.wc)
	})
</script>

<div bind:this={element} />
