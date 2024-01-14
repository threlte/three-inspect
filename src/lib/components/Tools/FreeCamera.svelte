<script
	context="module"
	lang="ts"
>
	const freeCamPosition = persisted('freeCamPosition', [0, 0, 5])
	const freeCamQuat = persisted('freeCamQuat', [0, 0, 0, 1])
</script>

<script lang="ts">
	import * as THREE from 'three'
	import { T, useThrelte, watch } from '@threlte/core'
	import { onDestroy } from 'svelte'
	import CameraControls from '../Internal/CameraControls.svelte'
	import { getInternalContext } from '../../internal/context'
	import { persisted } from '../../internal/persisted'

	const { camera } = useThrelte()
	const { defaultCamera } = getInternalContext()
	const freeCamera = new THREE.PerspectiveCamera()

	defaultCamera.set(camera.current)
	watch(camera, (newCamera) => {
		if (newCamera !== freeCamera) {
			defaultCamera.set(newCamera)
			camera.set(freeCamera)
		}
	})

	freeCamera.position.fromArray($freeCamPosition)
	freeCamera.quaternion.fromArray($freeCamQuat)

	onDestroy(() => {
		freeCamPosition.set([0, 0, 5])
		freeCamQuat.set([0, 0, 0, 1])
		if (defaultCamera.current) camera.set(defaultCamera.current)
	})
</script>

<svelte:window
	on:beforeunload={() => {
		freeCamPosition.set(freeCamera.position.toArray())
		freeCamQuat.set(freeCamera.position.toArray())
	}}
/>

<T
	is={freeCamera}
	makeDefault
	fov={50}
>
	<CameraControls camera={freeCamera} />
</T>
