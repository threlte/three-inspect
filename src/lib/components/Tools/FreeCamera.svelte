<script
	context="module"
	lang="ts"
>
	import { persisted } from '../../internal/persisted'

	const freeCamPosition = persisted('freeCamPosition', [0, 0, 5])
	const freeCamQuat = persisted('freeCamQuat', [0, 0, 0, 1])
</script>

<script lang="ts">
	import { PerspectiveCamera } from 'three'
	import { T, useThrelte, watch } from '@threlte/core'
	import { onDestroy } from 'svelte'
	import CameraControls from '../Internal/CameraControls.svelte'
	import { getInternalContext } from '../../internal/context'

	const { camera } = useThrelte()
	const { defaultCamera } = getInternalContext()
	const freeCamera = new PerspectiveCamera()

	defaultCamera.set(camera.current)
	watch(camera, ($camera) => {
		if ($camera !== freeCamera) {
			defaultCamera.set($camera)
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
