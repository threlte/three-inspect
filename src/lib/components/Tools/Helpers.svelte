<script lang="ts">
	import { type Object3D, type CameraHelper, Light } from 'three'
	import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
	import { T, useTask } from '@threlte/core'
	import { getInternalContext } from '../../internal/context'

	const { usingFreeCamera } = getInternalContext()

	export let object: Object3D

	let ref: CameraHelper | undefined

	useTask(() => ref?.update())
</script>

{#if 'isCamera' in object}
	{#if $usingFreeCamera}
		<T.CameraHelper
			bind:ref
			args={[object]}
		/>
	{/if}
{:else if object instanceof Light}
	{#if object.shadow}
		<T.CameraHelper args={[object.shadow.camera]} />
	{/if}

	{#if 'isDirectionalLight' in object}
		<T.DirectionalLightHelper args={[object, 10]} />
	{:else if 'isSpotLight' in object}
		<T.SpotLightHelper args={[object]} />
	{:else if 'isPointLight' in object}
		<T.PointLightHelper args={[object, 10]} />
	{:else if 'isHemisphereLight' in object}
		<T.HemisphereLightHelper args={[object, 10]} />
	{:else if 'isRectAreaLight' in object}
		<T
			is={RectAreaLightHelper}
			args={[object]}
		/>
	{/if}
{/if}
