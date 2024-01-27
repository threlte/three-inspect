<script lang="ts">
	import { Folder, List, type BindingRef } from 'svelte-tweakpane-ui'
	import * as THREE from 'three'
	import Color from './Color.svelte'
	import SerializedBinding from './SerializedBinding.svelte'
	import Textures from './Textures.svelte'
	import { onDestroy } from 'svelte'

	export let object: THREE.Material

	$: object.needsUpdate = true

	// Transparency needs some extra care since Three.js needs to push the updated
	// material to the GPU
	let transparentBindingRef: BindingRef
	const onTransparentChange = () => {
		object.needsUpdate = true
	}
	$: if (transparentBindingRef) {
		transparentBindingRef.on('change', onTransparentChange)
	}
	onDestroy(() => {
		if (transparentBindingRef) {
			transparentBindingRef.off('change', onTransparentChange)
		}
	})
</script>

<SerializedBinding
	bind:object
	key="visible"
	label="visible"
/>

<SerializedBinding
	bind:object
	key="transparent"
	label="transparent"
	bind:ref={transparentBindingRef}
/>

<SerializedBinding
	bind:object
	key="opacity"
	label="opacity"
	options={{ min: 0, max: 1 }}
/>

{#if 'color' in object}
	<Color
		label="color"
		{object}
	/>
{/if}

{#if 'emissive' in object}
	<Color
		bind:object
		key="emissive"
		label="emissive"
	/>
{/if}

{#if 'emissiveIntensity' in object}
	<SerializedBinding
		bind:object
		key="emissiveIntensity"
		label="emissiveIntensity"
		options={{ min: 0 }}
	/>
{/if}

{#if 'envMapIntensity' in object}
	<SerializedBinding
		bind:object
		key="envMapIntensity"
		label="envMapIntensity"
	/>
{/if}

{#if 'reflectivity' in object}
	<SerializedBinding
		bind:object
		key="reflectivity"
		label="reflectivity"
		options={{ min: 0, max: 1 }}
	/>
{/if}

{#if 'refractionRatio' in object}
	<SerializedBinding
		bind:object
		key="refractionRatio"
		label="refractionRatio"
		options={{ min: 0, max: 1 }}
	/>
{/if}

{#if 'shininess' in object}
	<SerializedBinding
		bind:object
		key="shininess"
		label="shininess"
		options={{ min: 0, max: 1 }}
	/>
{/if}

{#if 'isMeshStandardMaterial' in object}
	<SerializedBinding
		bind:object
		key="roughness"
		label="roughness"
		options={{ min: 0, max: 1 }}
	/>
	<SerializedBinding
		bind:object
		key="metalness"
		label="metalness"
		options={{ min: 0, max: 1 }}
	/>
{/if}

{#if 'isMeshPhysicalMaterial' in object}
	<SerializedBinding
		bind:object
		key="clearcoat"
		label="clearcoat"
		options={{ min: 0, max: 1 }}
	/>
	<SerializedBinding
		bind:object
		key="clearcoatRoughness"
		label="clearcoatRoughness"
		options={{ min: 0, max: 1 }}
	/>
	<SerializedBinding
		bind:object
		key="transmission"
		label="transmission"
		options={{ min: 0, max: 1 }}
	/>
	<SerializedBinding
		bind:object
		key="ior"
		label="ior"
		options={{ min: 0, max: 1 }}
	/>
	<SerializedBinding
		bind:object
		key="sheen"
		label="sheen"
		options={{ min: 0, max: 1 }}
	/>
	<SerializedBinding
		bind:object
		key="sheenRoughness"
		label="sheenRoughness"
		options={{ min: 0, max: 1 }}
	/>
	<Color
		key="attenuationColor"
		label="attenuationColor"
		{object}
	/>
	<Color
		key="sheenColor"
		label="sheenColor"
		{object}
	/>
{/if}

<Folder
	title="textures"
	expanded={false}
>
	<Textures {object} />
</Folder>

<SerializedBinding
	bind:object
	key="alphaHash"
	label="alphaHash"
/>
<SerializedBinding
	bind:object
	key="alphaTest"
	label="alphaTest"
/>
<SerializedBinding
	bind:object
	key="alphaToCoverage"
	label="alphaToCoverage"
/>

<Folder
	title="blending"
	expanded={false}
>
	<SerializedBinding
		bind:object
		key="blendAlpha"
		label="blendAlpha"
	/>
	<Color
		key="blendColor"
		label="blendColor"
		{object}
	/>
	<SerializedBinding
		bind:object
		key="blendDst"
		label="blendDst"
	/>

	{#if object.blendDstAlpha}
		<SerializedBinding
			bind:object
			key="blendDstAlpha"
			label="blendDstAlpha"
		/>
	{/if}

	{#if object.blendEquationAlpha}
		<SerializedBinding
			bind:object
			key="blendEquationAlpha"
			label="blendEquationAlpha"
		/>
	{/if}

	<SerializedBinding
		bind:object
		key="blending"
		label="blending"
	/>
	<SerializedBinding
		bind:object
		key="blendSrc"
		label="blendSrc"
	/>

	{#if object.blendSrcAlpha}
		<SerializedBinding
			bind:object
			key="blendSrcAlpha"
			label="blendSrcAlpha"
		/>
	{/if}
</Folder>

<SerializedBinding
	bind:object
	key="clipIntersection"
	label="clipIntersection"
/>
<SerializedBinding
	bind:object
	key="clipShadows"
	label="clipShadows"
/>
<SerializedBinding
	bind:object
	key="colorWrite"
	label="colorWrite"
/>

{#if 'combine' in object}
	<List
		bind:value={object.combine}
		label="combine"
		options={{
			MultiplyOperation: THREE.MultiplyOperation,
			MixOperation: THREE.MixOperation,
			AddOperation: THREE.AddOperation,
		}}
	/>
{/if}

<Folder
	title="depth"
	expanded={false}
>
	<SerializedBinding
		bind:object
		key="depthFunc"
		label="depthFunc"
	/>
	<SerializedBinding
		bind:object
		key="depthTest"
		label="depthTest"
	/>
	<SerializedBinding
		bind:object
		key="depthWrite"
		label="depthWrite"
	/>
	<SerializedBinding
		bind:object
		key="forceSinglePass"
		label="forceSinglePass"
	/>
</Folder>

<Folder
	title="stencil"
	expanded={false}
>
	<SerializedBinding
		bind:object
		key="stencilWrite"
		label="stencilWrite"
	/>
	<SerializedBinding
		bind:object
		key="stencilWriteMask"
		label="stencilWriteMask"
	/>
	<SerializedBinding
		bind:object
		key="stencilFunc"
		label="stencilFunc"
	/>
	<SerializedBinding
		bind:object
		key="stencilRef"
		label="stencilRef"
	/>
	<SerializedBinding
		bind:object
		key="stencilFuncMask"
		label="stencilFuncMask"
	/>
	<SerializedBinding
		bind:object
		key="stencilFail"
		label="stencilFail"
	/>
	<SerializedBinding
		bind:object
		key="stencilZFail"
		label="stencilZFail"
	/>
	<SerializedBinding
		bind:object
		key="stencilZPass"
		label="stencilZPass"
	/>
</Folder>

<SerializedBinding
	bind:object
	key="polygonOffset"
	label="polygonOffset"
/>
<SerializedBinding
	bind:object
	key="polygonOffsetFactor"
	label="polygonOffsetFactor"
/>
<SerializedBinding
	bind:object
	key="polygonOffsetUnits"
	label="polygonOffsetUnits"
/>
<SerializedBinding
	bind:object
	key="premultipliedAlpha"
	label="premultipliedAlpha"
/>
<SerializedBinding
	bind:object
	key="dithering"
	label="dithering"
/>

<List
	bind:value={object.side}
	label="side"
	options={{
		FrontSide: THREE.FrontSide,
		BackSide: THREE.BackSide,
		DoubleSide: THREE.DoubleSide,
	}}
/>

{#if 'shadowSide' in object}
	<List
		bind:value={object.shadowSide}
		label="shadowSide"
		options={{
			FrontSide: THREE.FrontSide,
			BackSide: THREE.BackSide,
			DoubleSide: THREE.DoubleSide,
		}}
	/>
{/if}

<SerializedBinding
	bind:object
	key="toneMapped"
	label="toneMapped"
/>

{#if 'flatShading' in object}
	<SerializedBinding
		bind:object
		key="flatShading"
		label="flatShading"
	/>
{/if}

{#if 'wireframe' in object}
	<SerializedBinding
		bind:object
		key="wireframe"
		label="wireframe"
	/>
{/if}

{#if 'fog' in object}
	<SerializedBinding
		bind:object
		key="fog"
		label="fog"
	/>
{/if}

{#if 'size' in object && 'sizeAttenuation' in object}
	<SerializedBinding
		bind:object
		key="size"
		label="size"
	/>
	<SerializedBinding
		bind:object
		key="sizeAttenuation"
		label="sizeAttenuation"
	/>
{/if}

<SerializedBinding
	bind:object
	key="vertexColors"
	label="vertexColors"
/>
