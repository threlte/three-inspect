<script lang="ts">
	import { T } from '@threlte/core'
	import { TransformControls } from '@threlte/extras'
	import { onDestroy } from 'svelte'
	import { Box3, Object3D, Vector3 } from 'three'
	import { DEG2RAD } from 'three/src/math/MathUtils.js'
	import { useStudio } from '../../internal/extensions'
	import { useObjectSelection } from '../object-selection/useObjectSelection.svelte'
	import { useSnapping } from '../snapping/useSnapping.svelte'
	import { useSpace } from '../space/useSpace'
	import {
		transformControlsScope,
		type TransformControlsActions,
		type TransformControlsState,
	} from './types'
	import { useRegisterControlObjects } from './useRegisterControlObjects.svelte'

	const objectSelection = useObjectSelection()
	const { getExtension } = useStudio()
	const transformControlsExtension = getExtension<
		TransformControlsState,
		TransformControlsActions,
		true
	>(transformControlsScope)
	const space = useSpace()
	const snapping = useSnapping()
	const reg = useRegisterControlObjects()

	const mode = $derived(transformControlsExtension.state.mode)

	let centerObject = new Object3D()
	let lastPosition = new Vector3()

	$effect(() => {
		if (objectSelection.selectedObjects.length === 0) return
		// make bb with all selected objects
		const bb = new Box3().setFromObject(objectSelection.selectedObjects[0])
		for (let i = 1; i < objectSelection.selectedObjects.length; i++) {
			bb.expandByObject(objectSelection.selectedObjects[i])
		}
		lastPosition.copy(bb.getCenter(new Vector3()))
		centerObject.position.copy(lastPosition)
	})

	const onChange = () => {
		if (mode === 'translate') {
			const delta = new Vector3().subVectors(centerObject.position, lastPosition)
			for (const object of objectSelection.selectedObjects) {
				// object.position.add(delta)
				if (space.space === 'world') {
					if (!object.parent) {
						// world space is local space
						object.position.add(delta)
					} else {
						// translate in world space
						const worldPosition = new Vector3()
						object.getWorldPosition(worldPosition)
						worldPosition.add(delta)
						const localPosition = object.parent.worldToLocal(worldPosition)
						object.position.copy(localPosition)
					}
				} else {
					object.position.add(delta)
				}
			}
			lastPosition.copy(centerObject.position)
		} else if (mode === 'rotate') {
			// TODO: implement rotation
		} else {
			// TODO: implement scale
		}
	}

	onDestroy(() => {
		transformControlsExtension.run('setInUse', false)
	})
</script>

<T is={centerObject} />

<TransformControls
	object={centerObject}
	space={space.space}
	translationSnap={snapping.enabled ? snapping.translate ?? 0 : null}
	rotationSnap={snapping.enabled ? (snapping.rotate ?? 0) * DEG2RAD : null}
	scaleSnap={snapping.enabled ? snapping.scale ?? 0 : null}
	on:change={onChange}
	on:mouseDown={() => {
		transformControlsExtension.run('setInUse', true)
	}}
	on:mouseUp={() => {
		transformControlsExtension.run('setInUse', false)
	}}
	{mode}
	bind:controls={reg.controls}
	bind:group={reg.group}
/>
