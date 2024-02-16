<script lang="ts">
	import { T, watch } from '@threlte/core'
	import { TransformControls } from '@threlte/extras'
	import { Box3, Object3D, Vector3 } from 'three'
	import { useStudio } from '../../internal/extensions'
	import { useObjectSelection } from '../object-selection/useObjectSelection'
	import { useStudioObjectsRegistry } from '../studio-objects-registry/useStudioObjectsRegistry'
	import {
		transformControlsScope,
		type TransformControlsActions,
		type TransformControlsState,
	} from './types'
	import { onMount } from 'svelte'

	const { selectedObjects } = useObjectSelection()
	const { getExtension } = useStudio()
	const { run, state } = getExtension<TransformControlsState, TransformControlsActions>(
		transformControlsScope,
	)

	let centerObject = new Object3D()
	let lastPosition = new Vector3()

	watch(selectedObjects, (objects) => {
		if (objects.length === 0) return
		// make bb with all selected objects
		const bb = new Box3().setFromObject(objects[0])
		for (let i = 1; i < objects.length; i++) {
			bb.expandByObject(objects[i])
		}
		lastPosition.copy(bb.getCenter(new Vector3()))
		centerObject.position.copy(lastPosition)
	})

	const onChange = () => {
		const delta = new Vector3().subVectors(centerObject.position, lastPosition)
		for (const object of $selectedObjects) {
			object.position.add(delta)
		}
		lastPosition.copy(centerObject.position)
	}

	const { addObject, removeObject } = useStudioObjectsRegistry()

	const mode = state.select((s) => s.mode)

	const setIgnoreOverrideMaterial = (ref: any) => {
		ref.traverse((node: any) => {
			node.userData.ignoreOverrideMaterial = true
		})
	}
</script>

<T is={centerObject} />

<TransformControls
	object={centerObject}
	on:change={onChange}
	on:mouseDown={() => {
		run('setInUse', true)
	}}
	on:mouseUp={() => {
		run('setInUse', false)
	}}
	mode={$mode}
	on:create={({ ref, cleanup }) => {
		setIgnoreOverrideMaterial(ref)
		addObject(ref)
		cleanup(() => {
			removeObject(ref)
		})
	}}
/>
