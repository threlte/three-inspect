<script lang="ts">
	import { onDestroy } from 'svelte'
	import { get } from 'svelte/store'
	import {
		DoubleSide,
		GreaterDepth,
		GreaterEqualCompare,
		LessCompare,
		LessDepth,
		Mesh,
		MeshBasicMaterial,
		NeverDepth,
	} from 'three'
	import ToolbarButton from '../../components/ToolbarButton/ToolbarButton.svelte'
	import ToolbarItem from '../../components/ToolbarItem/ToolbarItem.svelte'
	import HorizontalButtonGroup from '../../components/Tools/HorizontalButtonGroup.svelte'
	import { useStudio } from '../../internal/extensions'
	import { useStudioObjectsRegistry } from '../studio-objects-registry/useStudioObjectsRegistry'
	import {
		objectSelectionScope,
		type ObjectSelectionActions,
		type ObjectSelectionState,
	} from './types'
	import SelectTweak from './SelectTweak.svelte'
	import SelectRect from './SelectRect.svelte'

	const { addExtension, removeExtension } = useStudio()

	const isMesh = (object: any): object is Mesh => {
		return 'isMesh' in object
	}

	const selectedMeshMaterial = new MeshBasicMaterial({
		transparent: true,
		opacity: 0.5,
		color: '#3662E3',
		side: DoubleSide,
	})

	const { addObject, removeObject } = useStudioObjectsRegistry()

	const { run, state } = addExtension<ObjectSelectionState, ObjectSelectionActions>({
		scope: objectSelectionScope,
		state: ({ persist }) => ({
			selectedObjects: [],
			enabled: persist(false),
			mode: 'tweak',
			inUse: false,
		}),
		actions: {
			selectObjects({ select, record }, objects) {
				// remove existing selection meshes
				const selectedObjects = select((s) => s.selectedObjects)
				get(selectedObjects).forEach((object) => {
					if (isMesh(object)) {
						const selectionMesh = object.children.find((child) => child.userData.selectionMesh)
						if (selectionMesh) {
							removeObject(selectionMesh)
							object.remove(selectionMesh)
						}
					}
				})
				// add new selection meshes
				objects.forEach((object) => {
					if (isMesh(object)) {
						const selectionMesh = new Mesh(object.geometry, selectedMeshMaterial)
						selectionMesh.userData.ignoreOverrideMaterial = true
						selectionMesh.userData.selectionMesh = true
						addObject(selectionMesh)
						object.add(selectionMesh)
					}
				})
				record(() => select((s) => s.selectedObjects).set(objects))
			},
			clearSelection({ select, record }) {
				const selectedObjects = select((s) => s.selectedObjects)
				get(selectedObjects).forEach((object) => {
					if (isMesh(object)) {
						const selectionMesh = object.children.find((child) => child.userData.selectionMesh)
						if (selectionMesh) {
							removeObject(selectionMesh)
							object.remove(selectionMesh)
						}
					}
				})
				record(() => selectedObjects.set([]))
			},
			addToSelection({ select, record }, objects) {
				objects.forEach((object) => {
					if (isMesh(object)) {
						const selectionMesh = new Mesh(object.geometry, selectedMeshMaterial)
						selectionMesh.userData.ignoreOverrideMaterial = true
						selectionMesh.userData.selectionMesh = true
						addObject(selectionMesh)
						object.add(selectionMesh)
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
						const selectionMesh = object.children.find((child) => child.userData.selectionMesh)
						if (selectionMesh) {
							removeObject(selectionMesh)
							object.remove(selectionMesh)
						}
					}
				})
				record(() => {
					select((s) => s.selectedObjects).update((selectedObjects) => {
						return selectedObjects.filter((object) => !objects.includes(object))
					})
				})
			},
			toggleEnabled({ select }) {
				select((s) => s.enabled).update((enabled) => !enabled)
			},
			setEnabled({ select }, enabled) {
				select((s) => s.enabled).set(enabled)
			},
			setMode({ select }, mode) {
				select((s) => s.mode).set(mode)
				if (mode === 'tweak') select((s) => s.inUse).set(false)
			},
			toggleMode({ select }) {
				const mode = select((s) => s.mode)
				mode.update((mode) => {
					return mode === 'tweak' ? 'rect' : 'tweak'
				})
				if (get(mode) === 'tweak') select((s) => s.inUse).set(false)
			},
			setInUse({ select }, inUse) {
				select((s) => s.inUse).set(inUse)
			},
			setModeTweak({ select }) {
				select((s) => s.mode).set('tweak')
			},
			setModeRect({ select }) {
				select((s) => s.mode).set('rect')
			},
		},
		keyMap({ shift }) {
			return {
				setModeTweak: {
					up: shift(),
				},
				setModeRect: {
					down: shift(),
				},
			}
		},
	})

	onDestroy(() => {
		removeExtension(objectSelectionScope)
	})

	const mode = state.select((s) => s.mode)
</script>

{#if $mode === 'tweak'}
	<SelectTweak />
{:else if $mode === 'rect'}
	<SelectRect />
{/if}

<ToolbarItem>
	<HorizontalButtonGroup>
		<ToolbarButton
			label="Select Tweak"
			active={$mode === 'tweak'}
			icon="mdiCursorPointer"
			tooltip="Hold Shift to Toggle"
			disabled
		/>

		<ToolbarButton
			label="Select Box"
			active={$mode === 'rect'}
			icon="mdiSelect"
			tooltip="Hold Shift to Toggle"
			disabled
		/>
	</HorizontalButtonGroup>
</ToolbarItem>
