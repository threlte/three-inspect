<script
	context="module"
	lang="ts"
>
	let installed = false
</script>

<script lang="ts">
	import {
		type PerspectiveCamera,
		type OrthographicCamera,
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

	import { useTask, useThrelte } from '@threlte/core'
	import { onDestroy } from 'svelte'
	import CameraControls from 'camera-controls'
	import { getInternalContext } from '../../internal/context'

	if (!installed) {
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
		installed = true
	}

	export let camera: PerspectiveCamera | OrthographicCamera

	const { renderer } = useThrelte()
	const { usingTransformControls } = getInternalContext()
	const cameraControls = new CameraControls(camera, renderer.domElement)

	useTask((delta) => {
		cameraControls.update(delta)
	})

	onDestroy(() => {
		cameraControls.dispose()
	})

	$: cameraControls.enabled = !$usingTransformControls
</script>
