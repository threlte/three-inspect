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
	import { onDestroy } from 'svelte'
	import { getInternalContext } from '../../internal/context'

	export let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera

	const { renderer, invalidate } = useThrelte()
	const { toolSettings } = getInternalContext()
	const cameraControls = new CameraControls(camera, renderer.domElement)

	cameraControls.addEventListener('update', invalidate)

	useTask(
		(delta) => {
			cameraControls.update(delta)
		},
		{
			autoInvalidate: false,
		}
	)

	onDestroy(() => {
		cameraControls.dispose()
		cameraControls.removeEventListener('update', invalidate)
	})

	$: cameraControls.enabled = !$toolSettings.transformControls.inUse
</script>
