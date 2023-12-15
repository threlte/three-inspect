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
	import { T, useThrelte, watch } from '@threlte/core'
	import { onDestroy } from 'svelte'
	import CameraControls from '../Internal/CameraControls.svelte'
	import { getInternalContext } from '../../internal/context'

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

	freeCamera.position.copy(object.position)
	freeCamera.quaternion.copy(object.quaternion)

	onDestroy(() => {
		object.position.copy(freeCamera.position)
		object.quaternion.copy(freeCamera.quaternion)
		if (defaultCamera.current) camera.set(defaultCamera.current)
	})
</script>

<T
	is={freeCamera}
	makeDefault
	fov={50}
>
	<CameraControls camera={freeCamera} />
</T>
