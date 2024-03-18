<script lang="ts">
	import { Vector2, Raycaster } from 'three'
	import { onMount } from 'svelte'
	import { useThrelte } from '@threlte/core'
	import { getInternalContext } from '../../internal/context'
	import { intersectObjects } from '../../internal/raycast'

	const { renderer, camera } = useThrelte()
	const { selectedObject } = getInternalContext()
	const down = new Vector2()
	const up = new Vector2()
	const raycaster = new Raycaster()
	const pointer = new Vector2()

	const recordDown = (event: PointerEvent) => {
		down.set(event.clientX, event.clientY)
	}

	const raycast = (event: MouseEvent) => {
		if (down.sub(up.set(event.clientX, event.clientY)).length() > 2) {
			return
		}

		// Calculate pointer position in normalized device coordinates
		pointer.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1
		pointer.y = -((event.clientY / renderer.domElement.clientHeight) * 2) + 1

		// Update the picking ray with the camera and pointer position
		raycaster.setFromCamera(pointer, camera.current)

		let hits = raycaster.intersectObjects(intersectObjects)
		let hit = hits.shift()

		while (hit?.object.userData.threeInspectSkipRaycast) {
			hit = hits.shift()
		}

		selectedObject.set(hit?.object)
	}

	onMount(() => {
		renderer.domElement.addEventListener('pointerdown', recordDown)
		renderer.domElement.addEventListener('pointerup', raycast)
		return () => {
			renderer.domElement.removeEventListener('pointerdown', recordDown)
			renderer.domElement.removeEventListener('pointerup', raycast)
		}
	})
</script>
