<script
	context="module"
	lang="ts"
>
	import * as THREE from 'three'

	const object = new THREE.Object3D()
	object.position.set(1, 1, 1)
	object.lookAt(0, 0, 0)
</script>

<script lang="ts">
	import { onDestroy } from 'svelte'
	import { T, useThrelte } from '@threlte/core'
	import CameraControls from '../Internal/CameraControls.svelte'

	const { camera } = useThrelte()
	const lastCamera = camera.current
	const freeCamera = new THREE.PerspectiveCamera()

	freeCamera.position.copy(object.position)
	freeCamera.quaternion.copy(object.quaternion)

	onDestroy(() => {
		object.position.copy(freeCamera.position)
		object.quaternion.copy(freeCamera.quaternion)
		camera.set(lastCamera)
	})
</script>

<T
	is={freeCamera}
	makeDefault
	fov={50}
>
	<CameraControls camera={freeCamera} />
</T>
