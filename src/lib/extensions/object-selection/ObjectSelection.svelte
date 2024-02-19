<script lang="ts">
	import { onDestroy } from 'svelte'
	import { get } from 'svelte/store'
	import { Mesh, MeshBasicMaterial } from 'three'
	import { useStudio } from '../../internal/extensions'
	import {
		objectSelectionScope,
		type ObjectSelectionActions,
		type ObjectSelectionState,
	} from './types'

	const { addExtension, removeExtension } = useStudio()

	const isMesh = (object: any): object is Mesh => {
		return 'isMesh' in object
	}

	addExtension<ObjectSelectionState, ObjectSelectionActions>({
		scope: objectSelectionScope,
		state: () => ({
			selectedObjects: [],
		}),
		actions: {
			selectObjects({ select, record }, objects) {
				// remove existing selection meshes
				const selectedObjects = select((s) => s.selectedObjects)
				get(selectedObjects).forEach((object) => {
					if (isMesh(object)) {
						const outlineMesh = object.children.find((child) => child.uuid === object.uuid)
						if (outlineMesh) {
							object.remove(outlineMesh)
						}
					}
				})
				// add new selection meshes
				objects.forEach((object) => {
					if (isMesh(object)) {
						const wireframeMesh = new Mesh(
							object.geometry,
							new MeshBasicMaterial({
								color: 'blue',
								wireframe: true,
								polygonOffset: true,
								polygonOffsetFactor: 10,
							}),
						)
						wireframeMesh.userData.ignoreOverrideMaterial = true
						wireframeMesh.userData.selectionMesh = true
						object.add(wireframeMesh)
					}
				})
				record(() => select((s) => s.selectedObjects).set(objects))
			},
			clearSelection({ select, record }) {
				const selectedObjects = select((s) => s.selectedObjects)
				get(selectedObjects).forEach((object) => {
					if (isMesh(object)) {
						const outlineMesh = object.children.find((child) => child.uuid === object.uuid)
						if (outlineMesh) {
							object.remove(outlineMesh)
						}
					}
				})
				record(() => selectedObjects.set([]))
			},
			addToSelection({ select, record }, objects) {
				objects.forEach((object) => {
					if (isMesh(object)) {
						const wireframeMesh = new Mesh(
							object.geometry,
							new MeshBasicMaterial({
								color: 'blue',
								wireframe: true,
								polygonOffset: true,
								polygonOffsetFactor: 10,
							}),
						)
						wireframeMesh.userData.ignoreOverrideMaterial = true
						wireframeMesh.userData.selectionMesh = true
						object.add(wireframeMesh)
					}
				})
				record(() => {
					select((s) => s.selectedObjects).update((selectedObjects) => {
						return [...selectedObjects, ...objects]
					})
				})
			},
			removeFromSelection({ select, record }, objects) {
				objects.forEach((object) => {
					if (isMesh(object)) {
						const wireframeMesh = object.children.find((child) => child.userData.selectionMesh)
						if (wireframeMesh) {
							object.remove(wireframeMesh)
						}
					}
				})
				record(() => {
					select((s) => s.selectedObjects).update((selectedObjects) => {
						return selectedObjects.filter((object) => !objects.includes(object))
					})
				})
			},
		},
	})

	onDestroy(() => {
		removeExtension(objectSelectionScope)
	})
</script>
