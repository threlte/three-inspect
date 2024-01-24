<script lang="ts">
	import { useThrelte } from '@threlte/core'
	import { onMount } from 'svelte'
	import * as THREE from 'three'
	import { getInternalContext } from '../../internal/context'

	const { renderer, camera, scene } = useThrelte()
	const { selectedObject, studioObjects } = getInternalContext()
	const down = new THREE.Vector2()
	const up = new THREE.Vector2()
	const raycaster = new THREE.Raycaster()
	const pointer = new THREE.Vector2()

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

		let hits = raycaster.intersectObject(scene, true)
		let hit = hits.shift()

		const isOrIsChildOfStudioObject = (object: THREE.Object3D): boolean => {
			if (studioObjects.current.has(object)) return true
			if (object.parent) return isOrIsChildOfStudioObject(object.parent)
			return false
		}

		const isScene = (object: any): boolean => {
			return object.isScene
		}

		while (hit && (isOrIsChildOfStudioObject(hit.object) || isScene(hit.object))) {
			hit = hits.shift()
		}

		if (!hit || !hit.object) {
			selectedObject.set(undefined)
		} else {
			selectedObject.set(hit.object as any)
		}
	}

	onMount(() => {
		renderer.domElement.addEventListener('pointerdown', recordDown)
		renderer.domElement.addEventListener('pointerup', raycast)
		renderer.domElement.style.cursor = 'crosshair'
		return () => {
			renderer.domElement.removeEventListener('pointerdown', recordDown)
			renderer.domElement.removeEventListener('pointerup', raycast)
			renderer.domElement.style.cursor = 'auto'
		}
	})
</script>
