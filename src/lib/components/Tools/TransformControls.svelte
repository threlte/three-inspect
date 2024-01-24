<script lang="ts">
	import type * as THREE from 'three'
	import { useThrelte } from '@threlte/core'
	import { TransformControls } from '@threlte/extras'
	import { getInternalContext } from '../../internal/context'
	import { persisted } from '../../internal/persisted'
	import { add } from '../../hooks/useOnAdd'

	export let object: THREE.Object3D

	const { scene } = useThrelte()
	const { toolSettings, studioObjects } = getInternalContext()

	type Modes = 'translate' | 'rotate' | 'scale'
	type Spaces = 'local' | 'world'

	const mode = persisted<Modes>('transform-mode', 'translate')
	const space = persisted<Spaces>('transform-space', 'local')

	const toggleSpace = () => {
		$space = $space === 'local' ? 'world' : 'local'
	}

	const keydown = (event: KeyboardEvent) => {
		if (event.metaKey) return

		const key = event.key.toLowerCase()

		switch (key) {
			case 't': {
				if ($mode === 'translate') {
					toggleSpace()
				} else {
					mode.set('translate')
				}
				break
			}
			case 'r': {
				if ($mode === 'rotate') {
					toggleSpace()
				} else {
					mode.set('rotate')
				}
				break
			}
			case 's': {
				if ($mode === 'scale') {
					toggleSpace()
				} else {
					mode.set('scale')
				}
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
	space={$space}
	autoPauseOrbitControls
	on:create={({ ref, cleanup }) => {
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
