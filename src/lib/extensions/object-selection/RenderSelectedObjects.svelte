<script lang="ts">
	import { T, useTask, useThrelte, watch } from '@threlte/core'
	import { Portal } from '@threlte/extras'
	import { MeshBasicMaterial, RGBAFormat, WebGLRenderTarget, type PerspectiveCamera } from 'three'
	import { useStudioObjectsRegistry } from '../studio-objects-registry/useStudioObjectsRegistry'
	import { useObjectSelection } from './useObjectSelection'

	const { selectedObjects } = useObjectSelection()
	const { addObject, removeObject } = useStudioObjectsRegistry()

	const { size, renderer, autoRenderTask, scene, camera } = useThrelte()

	const renderTarget = new WebGLRenderTarget(
		$size.width * renderer.getPixelRatio(),
		$size.height * renderer.getPixelRatio(),
		{
			format: RGBAFormat,
		},
	)

	watch(size, (size) => {
		renderTarget.setSize(
			size.width * renderer.getPixelRatio(),
			size.height * renderer.getPixelRatio(),
		)
	})

	const overrideMaterial = new MeshBasicMaterial({
		color: 'blue',
	})
	useTask(
		() => {
			// render to renderTarget
			const originalRenderTarget = renderer.getRenderTarget()
			const currentCameraMask = camera.current.layers.mask
			camera.current.layers.set(31)
			const currentSceneBackground = scene.background
			$selectedObjects.forEach((object) => {
				object.userData.originalLayer = object.layers.mask
				object.layers.enable(31)
			})
			const originalOverrideMaterial = scene.overrideMaterial
			scene.overrideMaterial = overrideMaterial
			scene.background = null
			const currentClearAlpha = renderer.getClearAlpha()
			renderer.setRenderTarget(renderTarget)
			renderer.render(scene, camera.current)
			renderer.setRenderTarget(originalRenderTarget)
			camera.current.layers.mask = currentCameraMask
			renderer.setClearAlpha(currentClearAlpha)
			scene.background = currentSceneBackground
			$selectedObjects.forEach((object) => {
				object.layers.mask = object.userData.originalLayer
			})
			scene.overrideMaterial = originalOverrideMaterial
		},
		{
			before: autoRenderTask,
			autoInvalidate: false,
		},
	)

	var getExtends = function (camera: PerspectiveCamera, distance: number) {
		const y = Math.tan(((camera.fov * Math.PI) / 180) * 0.5) * distance * 2
		const x = y * camera.aspect
		return {
			x,
			y,
		}
	}

	const isPerspectiveCamera = (object: any): object is PerspectiveCamera => {
		return 'isPerspectiveCamera' in object
	}
</script>

{#if isPerspectiveCamera($camera)}
	<Portal object={$camera}>
		<T.Mesh
			raycast={() => {}}
			position.z={-5}
			scale.x={getExtends($camera, 5).x}
			scale.y={getExtends($camera, 5).y}
			on:create={({ ref, cleanup }) => {
				addObject(ref)
				cleanup(() => {
					removeObject(ref)
				})
			}}
		>
			<T.PlaneGeometry />

			<T.MeshBasicMaterial
				color="white"
				transparent
				map={renderTarget.texture}
				depthWrite={false}
				depthTest={false}
			/>
		</T.Mesh>
	</Portal>
{/if}
