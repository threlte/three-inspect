<script lang="ts">
	import { useTask, useThrelte } from '@threlte/core'
	import { onMount } from 'svelte'
	import { Element, Pane } from 'svelte-tweakpane-ui'
	import { get } from 'svelte/store'
	import {
		Vector2,
		Vector4,
		type Camera,
		type OrthographicCamera,
		type PerspectiveCamera,
	} from 'three'
	import Portal from '../../components/Internal/Portal.svelte'
	import { useStudio } from '../../internal/extensions'
	import {
		studioObjectsRegistryScope,
		type StudioObjectsRegistryActions,
		type StudioObjectsRegistryState,
	} from '../studio-objects-registry/types'
	import { editorCameraScope, type EditorCameraActions, type EditorCameraState } from './types'

	const { getExtension } = useStudio()
	const { renderer, scene, autoRenderTask, invalidate } = useThrelte()

	const { state } = getExtension<EditorCameraState, EditorCameraActions>(editorCameraScope)
	const { state: studioObjectsRegistryState } = getExtension<
		StudioObjectsRegistryState,
		StudioObjectsRegistryActions
	>(studioObjectsRegistryScope)
	const defaultCameraObject = state.select((s) => s.defaultCamera.object)
	const width = state.select((s) => s.defaultCamera.width)
	const height = state.select((s) => s.defaultCamera.height)

	let canvasEl: HTMLCanvasElement
	$: context = canvasEl?.getContext('2d') ?? undefined

	let previousAspect = 0
	const setupPerspectiveCamera = (camera: PerspectiveCamera) => {
		previousAspect = camera.aspect
		// set up perspective cam to be 16/9
		camera.aspect = $width / $height
		camera.updateProjectionMatrix()
	}

	let previousLeft = 0
	let previousRight = 0
	const updateOrthographicCamera = (camera: OrthographicCamera) => {
		// set up ortho cam to be 16/9
		const frustumHeight = camera.top - camera.bottom
		const aspect = $width / $height
		previousLeft = camera.left
		previousRight = camera.right
		camera.left = -frustumHeight * aspect
		camera.right = frustumHeight * aspect
		camera.updateProjectionMatrix()
	}

	const updateCamera = (camera: Camera) => {
		if ((camera as any).isPerspectiveCamera) {
			setupPerspectiveCamera(camera as PerspectiveCamera)
		} else if ((camera as any).isOrthographicCamera) {
			updateOrthographicCamera(camera as OrthographicCamera)
		}
	}

	const resetPerspectiveCamera = (camera: PerspectiveCamera) => {
		camera.aspect = previousAspect
		camera.updateProjectionMatrix()
	}

	const resetOrthographicCamera = (camera: OrthographicCamera) => {
		camera.left = previousLeft
		camera.right = previousRight
		camera.updateProjectionMatrix()
	}

	const resetCamera = (camera: Camera) => {
		if ((camera as any).isPerspectiveCamera) {
			resetPerspectiveCamera(camera as PerspectiveCamera)
		} else if ((camera as any).isOrthographicCamera) {
			resetOrthographicCamera(camera as OrthographicCamera)
		}
	}

	const viewport = new Vector4()
	const size = new Vector2()
	let dpr = 0

	const studioObjects = studioObjectsRegistryState.select((s) => s.objects)

	useTask(
		() => {
			if (!context) return
			const defaultCamera = get(defaultCameraObject)
			if (!defaultCamera) return

			updateCamera(defaultCamera)

			renderer.getViewport(viewport)
			renderer.getSize(size)

			const setupCanvas = dpr === 0

			dpr = renderer.getPixelRatio()

			if (setupCanvas) {
				canvasEl.width = $width * dpr
				canvasEl.height = $height * dpr
			}

			// set viewport
			renderer.setViewport(0, 0, $width, $height)

			$studioObjects.forEach((obj) => {
				obj.visible = false
			})

			const originalOverrideMaterial = scene.overrideMaterial
			scene.overrideMaterial = null

			renderer.render(scene, defaultCamera)

			scene.overrideMaterial = originalOverrideMaterial

			$studioObjects.forEach((obj) => {
				obj.visible = true
			})

			// reset viewport
			renderer.setViewport(viewport)

			// draw to canvas
			context.clearRect(0, 0, $width * dpr, $height * dpr)
			context.drawImage(
				renderer.domElement,
				0,
				(size.y - $height) * dpr,
				$width * dpr,
				$height * dpr,
				0,
				0,
				$width * dpr,
				$height * dpr,
			)

			resetCamera(defaultCamera)
		},
		{
			before: autoRenderTask,
			autoInvalidate: false,
		},
	)

	onMount(invalidate)
</script>

<Portal>
	<Pane
		position="draggable"
		width={$width}
		title="Default Camera"
		userExpandable={false}
		expanded
		padding={'6px'}
		storePositionLocally={false}
		x={99999}
		y={99999}
	>
		<Element>
			<canvas
				bind:this={canvasEl}
				style="width: {$width}px; height: {$height}px; display: block"
			/>
		</Element>
	</Pane>
</Portal>
