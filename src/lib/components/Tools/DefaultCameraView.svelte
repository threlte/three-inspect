<script lang="ts">
	import { useTask, useThrelte } from '@threlte/core'
	import { Element } from 'svelte-tweakpane-ui'
	import { Camera, OrthographicCamera, PerspectiveCamera, Vector2, Vector4 } from 'three'
	import { getInternalContext } from '../../internal/context'

	export let width = 160
	export let height = 90

	const { autoRenderTask, renderer, scene } = useThrelte()
	const { defaultCamera } = getInternalContext()

	let canvasEl: HTMLCanvasElement

	$: context = canvasEl?.getContext('2d') ?? undefined

	let previousAspect = 0
	const setupPerspectiveCamera = (camera: PerspectiveCamera) => {
		previousAspect = camera.aspect
		// set up perspective cam to be 16/9
		camera.aspect = width / height
		camera.updateProjectionMatrix()
	}

	let previousLeft = 0
	let previousRight = 0
	const updateOrthographicCamera = (camera: OrthographicCamera) => {
		// set up ortho cam to be 16/9
		const frustumHeight = camera.top - camera.bottom
		const aspect = width / height
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
	useTask(
		() => {
			if (!context) return
			if (!defaultCamera.current) return

			updateCamera(defaultCamera.current)

			renderer.getViewport(viewport)
			renderer.getSize(size)

			const setupCanvas = dpr === 0

			dpr = renderer.getPixelRatio()

			if (setupCanvas) {
				canvasEl.width = width * dpr
				canvasEl.height = height * dpr
			}

			// set viewport
			renderer.setViewport(0, 0, width, height)

			renderer.render(scene, defaultCamera.current)

			// reset viewport
			renderer.setViewport(viewport)

			// draw to canvas
			context.drawImage(
				renderer.domElement,
				0,
				(size.y - height) * dpr,
				width * dpr,
				height * dpr,
				0,
				0,
				width * dpr,
				height * dpr
			)

			resetCamera(defaultCamera.current)
		},
		{
			before: autoRenderTask,
			autoInvalidate: false,
		}
	)
</script>

<Element>
	<canvas
		bind:this={canvasEl}
		style="width: {width}px; height: {height}px;"
	/>
</Element>
