<script lang="ts">
	import type * as THREE from 'three'
	import { useThrelte } from '@threlte/core'
	import { TransformControls } from '@threlte/extras'
	import { getInternalContext } from '../../internal/context'
	import { persisted } from '../../internal/persisted'
	import { add } from '../../hooks/useOnAdd'

	export let object: THREE.Object3D

	const { scene } = useThrelte()
	const { usingTransformControls } = getInternalContext()

	type Modes = 'translate' | 'rotate' | 'scale'

	const mode = persisted<Modes>('transform-mode', 'translate')

	const keydown = (event: KeyboardEvent) => {
		if (event.metaKey) return

		const key = event.key.toLowerCase()

		switch (key) {
			case 't': {
				mode.set('translate')
				break
			}
			case 'r': {
				mode.set('rotate')
				break
			}
			case 's': {
				mode.set('scale')
				break
			}
		}
	}

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

<svelte:window on:keydown={keydown} />

<TransformControls
	bind:controls
	bind:group
	{object}
	mode={$mode}
	autoPauseOrbitControls
	on:mouseDown={() => {
		usingTransformControls.set(true)
	}}
	on:mouseUp={() => {
		usingTransformControls.set(false)
	}}
/>
