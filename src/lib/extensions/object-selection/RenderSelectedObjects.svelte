<script lang="ts">
	import { T, useTask, useThrelte, watch } from '@threlte/core'
	import { Portal } from '@threlte/extras'
	import {
		MeshBasicMaterial,
		RGBAFormat,
		WebGLRenderTarget,
		type PerspectiveCamera,
		Color,
	} from 'three'
	import { useStudioObjectsRegistry } from '../studio-objects-registry/useStudioObjectsRegistry'
	import { useObjectSelection } from './useObjectSelection'
	import fragmentShader from './_fs.glsl?raw'
	import vertexShader from './_vs.glsl?raw'

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

	const numberSeedToHexColor = (seed: number) => {
		let color = (Math.round(Math.abs(seed)) % 0xffffff).toString(16)
		while (color.length < 6) {
			color = `0${color}`
		}
		return `#${color}`
	}

	const MATERIAL_POOL_SIZE = 32
	const overrideMaterialPool = new Map<number, MeshBasicMaterial>()

	const getOverrideMaterial = (id: number) => {
		// limits the amount of cached materials
		// I'm worried about performance impact if we had one material per object id.
		// though it means that if two meshes happen to have the same mapIndex
		// and overlap in screen space, then the edges won't get detected
		const mapIndex = id % MATERIAL_POOL_SIZE

		if (overrideMaterialPool.has(mapIndex)) return overrideMaterialPool.get(mapIndex)

		const newOverrideMaterial = new MeshBasicMaterial({
			color: numberSeedToHexColor(id),
		})

		overrideMaterialPool.set(mapIndex, newOverrideMaterial)

		return newOverrideMaterial
	}

	useTask(
		() => {
			// render to renderTarget
			const originalMaterials = new Map()
			const originalRenderTarget = renderer.getRenderTarget()
			const currentCameraMask = camera.current.layers.mask
			camera.current.layers.set(31)
			const currentSceneBackground = scene.background
			$selectedObjects.forEach((object) => {
				object.userData.originalLayer = object.layers.mask
				object.layers.enable(31)
				if (object.material) {
					originalMaterials.set(object.id, object.material)
					object.material = getOverrideMaterial(object.id)
				}
			})
			const originalOverrideMaterial = scene.overrideMaterial
			scene.overrideMaterial = null
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
				if (object.material) {
					object.material = originalMaterials.get(object.id)
				}
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

			<T.ShaderMaterial
				{fragmentShader}
				{vertexShader}
				uniforms={{
					outlinedObjectsTexture: {
						value: renderTarget.texture,
					},
					lineWidth: {
						value: 1.5,
					},
					outlineColor: {
						value: new Color('yellow'),
					},
					edgeFactor: {
						value: 0.0001,
					},
				}}
				uniforms.outlinedObjectsTexture.value={renderTarget.texture}
				depthWrite={false}
				depthTest={false}
				transparent
			/>
		</T.Mesh>
	</Portal>
{/if}
