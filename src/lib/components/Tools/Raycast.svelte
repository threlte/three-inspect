<script lang="ts">
	import * as THREE from 'three'
	import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
	import { onMount } from 'svelte'
	import { useThrelte } from '@threlte/core'
	import { getInternalContext } from '../../internal/context'
	import { intersectObjects } from '../../internal/intersectObjects'

	const { renderer, camera } = useThrelte()
	const { selectedObject } = getInternalContext()
	const raycaster = new THREE.Raycaster()
	const pointer = new THREE.Vector2()

	const raycast = (event: MouseEvent) => {
		// Calculate pointer position in normalized device coordinates
		pointer.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1
		pointer.y = -((event.clientY / renderer.domElement.clientHeight) * 2) + 1

		// Update the picking ray with the camera and pointer position
		raycaster.setFromCamera(pointer, camera.current)

		const [intersection] = raycaster.intersectObjects(intersectObjects)

		selectedObject.set(intersection?.object)
	}

	onMount(() => {
		renderer.domElement.addEventListener('pointerdown', raycast)
		return () => {
			renderer.domElement.removeEventListener('pointerdown', raycast)
		}
	})
</script>
