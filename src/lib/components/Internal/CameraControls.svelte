<script
	context="module"
	lang="ts"
>
	import CameraControls from 'camera-controls'
	import {
		Box3,
		MathUtils,
		Matrix4,
		Quaternion,
		Raycaster,
		Sphere,
		Spherical,
		Vector2,
		Vector3,
		Vector4,
	} from 'three'

	CameraControls.install({
		THREE: {
			Vector2,
			Vector3,
			Vector4,
			Quaternion,
			Matrix4,
			Spherical,
			Box3,
			Sphere,
			Raycaster,
			MathUtils,
		},
	})
</script>

<script lang="ts">
	import { useTask, useThrelte } from '@threlte/core'
	import { onDestroy, onMount, tick } from 'svelte'

	export let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera

	const { renderer, invalidate } = useThrelte()
	const cameraControls = new CameraControls(camera, renderer.domElement)

	cameraControls.dollyToCursor = true

	cameraControls.addEventListener('update', invalidate)
	onMount(async () => {
		await tick()
		cameraControls.setTarget(0, 0, 0)
		cameraControls.setPosition(10, 10, 10)
		// cameraControls.setTarget($target[0], $target[1], $target[2], false)
	})

	useTask(
		(delta) => {
			cameraControls.update(delta)
		},
		{
			autoInvalidate: false,
		},
	)

	onDestroy(() => {
		cameraControls.dispose()
		cameraControls.removeEventListener('update', invalidate)
	})

	// $: cameraControls.enabled = !$toolSettings.transformControls.inUse

	onDestroy(() => {
		// const v3 = new Vector3()
		// cameraControls.getTarget(v3)
	})
</script>
