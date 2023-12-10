<script
	context="module"
	lang="ts"
>
	import {
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
		Clock,
	} from 'three'
	import CameraControls from 'camera-controls'

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
	import { onDestroy } from 'svelte'
	import { useTask, useThrelte } from '@threlte/core'
	import { getInternalContext } from '../../internal/context'

	export let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera

	const { renderer } = useThrelte()
	const { usingTransformControls } = getInternalContext()
	const clock = new Clock()
	const cameraControls = new CameraControls(camera, renderer.domElement)

	useTask(() => {
		const delta = clock.getDelta()
		cameraControls.update(delta)
	})

	onDestroy(() => {
		cameraControls.dispose()
	})

	$: cameraControls.enabled = !$usingTransformControls
</script>
