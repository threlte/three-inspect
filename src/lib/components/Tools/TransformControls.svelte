<script lang="ts">
	import { useThrelte } from '@threlte/core'
	import { TransformControls } from '@threlte/extras'
	import type * as THREE from 'three'
	import { DEG2RAD } from 'three/src/math/MathUtils.js'
	import { add } from '../../hooks/useOnAdd'
	import { getInternalContext } from '../../internal/context'

	export let object: THREE.Object3D

	const { scene } = useThrelte()
	const { toolSettings, studioObjects } = getInternalContext()

	let controls: THREE.Object3D
	let group: THREE.Group

	$: controls?.traverse((node) => {
		node.userData.threeInspectSkipRaycast = true
	})
	$: group?.traverse((node) => {
		node.userData.threeInspectSkipRaycast = true
	})

	// Prevent controls from being shown in the Treeview
	$: if (controls && group) {
		scene.remove(controls)
		scene.remove(group)

		add.call(scene, controls)
		add.call(scene, group)
	}
</script>

<TransformControls
	bind:controls
	bind:group
	{object}
	mode={$toolSettings.transformControls.mode}
	space={$toolSettings.space}
	rotationSnap={$toolSettings.snapping.enabled ? $toolSettings.snapping.rotation.step * DEG2RAD : 0}
	translationSnap={$toolSettings.snapping.enabled ? $toolSettings.snapping.translation.step : 0}
	scaleSnap={$toolSettings.snapping.enabled ? $toolSettings.snapping.scale.step : 0}
	autoPauseOrbitControls
	on:create={({ ref, cleanup }) => {
		ref.traverse((node) => {
			node.userData.ignoreOverrideMaterial = true
		})
		studioObjects.update((objects) => {
			objects.add(ref)
			return objects
		})
		cleanup(() => {
			studioObjects.update((objects) => {
				objects.delete(ref)
				return objects
			})
		})
	}}
	on:mouseDown={() => {
		$toolSettings.transformControls.inUse = true
	}}
	on:mouseUp={() => {
		$toolSettings.transformControls.inUse = false
	}}
/>
