<script lang="ts">
	import { T, useTask } from '@threlte/core'
	import * as THREE from 'three'
	import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
	import { getInternalContext } from '../../internal/context'

	const { toolSettings, studioObjects } = getInternalContext()

	export let object: THREE.Object3D

	let ref: THREE.CameraHelper | undefined

	useTask(() => ref?.update(), { autoInvalidate: false })

	const onCreate = (args: { ref: THREE.Object3D; cleanup: (callback: () => void) => void }) => {
		studioObjects.update((objects) => {
			objects.add(args.ref)
			return objects
		})
		args.cleanup(() => {
			studioObjects.update((objects) => {
				objects.delete(args.ref)
				return objects
			})
		})
	}
</script>

{#if 'isCamera' in object}
	{#if $toolSettings.freeCamera.enabled}
		<T.CameraHelper
			bind:ref
			args={[object]}
			on:create={onCreate}
		/>
	{/if}
{:else if object instanceof THREE.Light}
	{#if object.shadow}
		<T.CameraHelper
			args={[object.shadow.camera]}
			on:create={onCreate}
		/>
	{/if}

	{#if 'isDirectionalLight' in object}
		<T.DirectionalLightHelper
			args={[object, 10]}
			on:create={onCreate}
		/>
	{:else if 'isSpotLight' in object}
		<T.SpotLightHelper
			args={[object]}
			on:create={onCreate}
		/>
	{:else if 'isPointLight' in object}
		<T.PointLightHelper
			args={[object, 10]}
			on:create={onCreate}
		/>
	{:else if 'isHemisphereLight' in object}
		<T.HemisphereLightHelper
			args={[object, 10]}
			on:create={onCreate}
		/>
	{:else if 'isRectAreaLight' in object}
		<T
			is={RectAreaLightHelper}
			on:create={onCreate}
			args={[object]}
		/>
	{/if}
{/if}
