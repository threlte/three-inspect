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
	import { useTask, useThrelte, watch } from '@threlte/core'
	import { createEventDispatcher, onMount, tick } from 'svelte'
	import { beforeUnload } from '../../internal/useBeforeUnload'
	import { useStudio } from '../../internal/extensions'
	import {
		transformControlsScope,
		type TransformControlsActions,
		type TransformControlsState,
	} from '../transform-controls/types'

	export let initialPosition: Vector3
	export let initialTarget: Vector3

	const dispatch = createEventDispatcher<{
		unmount: {
			position: Vector3
			target: Vector3
		}
	}>()

	export let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera

	const { renderer, invalidate } = useThrelte()

	const cameraControls = new CameraControls(camera, renderer.domElement)
	cameraControls.dollyToCursor = true

	onMount(async () => {
		await tick()
		cameraControls.setPosition(...initialPosition.toArray(), false)
		cameraControls.setTarget(...initialTarget.toArray(), false)
	})

	useTask(
		(delta) => {
			cameraControls.update(delta)
		},
		{
			autoInvalidate: false,
		},
	)

	const emitUnmount = () => {
		const position = new Vector3()
		const target = new Vector3()
		cameraControls.getPosition(position)
		cameraControls.getTarget(target)
		dispatch('unmount', {
			position,
			target,
		})
	}

	onMount(() => {
		cameraControls.addEventListener('update', invalidate)
		return () => {
			emitUnmount()
			cameraControls.removeEventListener('update', invalidate)
			cameraControls.dispose()
		}
	})

	const { getExtension } = useStudio()

	const { state } = getExtension<TransformControlsState, TransformControlsActions>(
		transformControlsScope,
	)

	const transformControlsInUse = state.select((s) => s.inUse)

	// disable camera controls when transform controls are in use
	watch(transformControlsInUse, (inUse) => {
		cameraControls.enabled = !inUse
	})

	beforeUnload(emitUnmount)
</script>
