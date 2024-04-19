<script lang="ts">
	import { Folder } from 'svelte-tweakpane-ui'
	import { BackSide, DoubleSide, FrontSide, type Material, type Object3D } from 'three'
	import TransactionalBinding from './TransactionalBinding.svelte'
	import TransactionalList from './TransactionalList.svelte'
	import { haveProperty } from './utils'

	type Props = {
		objects: (Object3D & { material: Material })[]
	}

	let { objects }: Props = $props()

	const materials = $derived(objects.map((o) => o.material))
</script>

<Folder
	title="material"
	expanded
>
	{#if haveProperty(materials, 'visible')}
		<TransactionalBinding
			objects={materials}
			key="visible"
			label="visible"
		/>
	{/if}

	{#if haveProperty(materials, 'transparent')}
		<TransactionalBinding
			objects={materials}
			key="transparent"
			label="transparent"
		/>
	{/if}

	{#if haveProperty(materials, 'opacity')}
		<TransactionalBinding
			objects={materials}
			key="opacity"
			label="opacity"
			options={{ min: 0, max: 1 }}
		/>
	{/if}

	{#if haveProperty(materials, 'color')}
		<TransactionalBinding
			objects={materials}
			key="color"
			label="color"
			options={{
				color: { type: 'float' },
			}}
		/>
	{/if}

	{#if haveProperty(materials, 'emissive')}
		<TransactionalBinding
			objects={materials}
			key="emissive"
			label="emissive"
			options={{
				color: { type: 'float' },
			}}
		/>
	{/if}

	{#if haveProperty(materials, 'emissiveIntensity')}
		<TransactionalBinding
			objects={materials}
			key="emissiveIntensity"
			label="emissiveIntensity"
			options={{ min: 0 }}
		/>
	{/if}

	{#if haveProperty(materials, 'envMapIntensity')}
		<TransactionalBinding
			objects={materials}
			key="envMapIntensity"
			label="envMapIntensity"
		/>
	{/if}

	{#if haveProperty(materials, 'reflectivity')}
		<TransactionalBinding
			objects={materials}
			key="reflectivity"
			label="reflectivity"
			options={{ min: 0, max: 1 }}
		/>
	{/if}

	{#if haveProperty(materials, 'refractionRatio')}
		<TransactionalBinding
			objects={materials}
			key="refractionRatio"
			label="refractionRatio"
			options={{ min: 0, max: 1 }}
		/>
	{/if}

	{#if haveProperty(materials, 'shininess')}
		<TransactionalBinding
			objects={materials}
			key="shininess"
			label="shininess"
			options={{ min: 0, max: 1 }}
		/>
	{/if}

	{#if haveProperty(materials, 'isMeshStandardMaterial')}
		<TransactionalBinding
			objects={materials}
			key="roughness"
			label="roughness"
			options={{ min: 0, max: 1 }}
		/>
		<TransactionalBinding
			objects={materials}
			key="metalness"
			label="metalness"
			options={{ min: 0, max: 1 }}
		/>
	{/if}

	{#if haveProperty(materials, 'isMeshPhysicalMaterial')}
		<TransactionalBinding
			objects={materials}
			key="clearcoat"
			label="clearcoat"
			options={{ min: 0, max: 1 }}
		/>
		<TransactionalBinding
			objects={materials}
			key="clearcoatRoughness"
			label="clearcoatRoughness"
			options={{ min: 0, max: 1 }}
		/>
		<TransactionalBinding
			objects={materials}
			key="transmission"
			label="transmission"
			options={{ min: 0, max: 1 }}
		/>
		<TransactionalBinding
			objects={materials}
			key="ior"
			label="ior"
			options={{ min: 0, max: 1 }}
		/>
		<TransactionalBinding
			objects={materials}
			key="sheen"
			label="sheen"
			options={{ min: 0, max: 1 }}
		/>
		<TransactionalBinding
			objects={materials}
			key="sheenRoughness"
			label="sheenRoughness"
			options={{ min: 0, max: 1 }}
		/>
		<TransactionalBinding
			objects={materials}
			key="attenuationColor"
			label="attenuationColor"
			options={{
				color: { type: 'float' },
			}}
		/>
		<TransactionalBinding
			objects={materials}
			key="sheenColor"
			label="sheenColor"
			options={{
				color: { type: 'float' },
			}}
		/>
	{/if}
	<!--
<Folder
	title="textures"
	expanded={false}
>
	<Textures {object} />
</Folder>-->

	<TransactionalBinding
		objects={materials}
		key="alphaHash"
		label="alphaHash"
	/>
	<TransactionalBinding
		objects={materials}
		key="alphaTest"
		label="alphaTest"
	/>
	<TransactionalBinding
		objects={materials}
		key="alphaToCoverage"
		label="alphaToCoverage"
	/>

	<Folder
		title="blending"
		expanded={false}
	>
		<TransactionalBinding
			objects={materials}
			key="blendAlpha"
			label="blendAlpha"
		/>
		<TransactionalBinding
			objects={materials}
			key="blendColor"
			label="blendColor"
			options={{
				color: { type: 'float' },
			}}
		/>
		<TransactionalBinding
			objects={materials}
			key="blendDst"
			label="blendDst"
		/>

		<!-- Unsupported: null | number -->
		<!-- {#if haveProperty(materials, 'blendDstAlpha')}
			<TransactionalBinding
				objects={materials}
				key="blendDstAlpha"
				label="blendDstAlpha"
			/>
		{/if} -->

		<!-- Unsupported: null | number -->
		<!-- {#if haveProperty(materials, 'blendEquationAlpha')}
			<TransactionalBinding
				objects={materials}
				key="blendEquationAlpha"
				label="blendEquationAlpha"
			/>
		{/if} -->

		<TransactionalBinding
			objects={materials}
			key="blending"
			label="blending"
		/>
		<TransactionalBinding
			objects={materials}
			key="blendSrc"
			label="blendSrc"
		/>

		<!-- Unsupported: null | number -->
		<!-- {#if haveProperty(materials, 'blendSrcAlpha')}
			<TransactionalBinding
				objects={materials}
				key="blendSrcAlpha"
				label="blendSrcAlpha"
			/>
		{/if} -->
	</Folder>

	<TransactionalBinding
		objects={materials}
		key="clipIntersection"
		label="clipIntersection"
	/>
	<TransactionalBinding
		objects={materials}
		key="clipShadows"
		label="clipShadows"
	/>
	<TransactionalBinding
		objects={materials}
		key="colorWrite"
		label="colorWrite"
	/>

	<!-- {#if 'combine' in object}
	<List
		bind:value={object.combine}
		label="combine"
		options={{
			MultiplyOperation: THREE.MultiplyOperation,
			MixOperation: THREE.MixOperation,
			AddOperation: THREE.AddOperation,
		}}
	/>
{/if} -->

	<Folder
		title="depth"
		expanded={false}
	>
		<TransactionalBinding
			objects={materials}
			key="depthFunc"
			label="depthFunc"
		/>
		<TransactionalBinding
			objects={materials}
			key="depthTest"
			label="depthTest"
		/>
		<TransactionalBinding
			objects={materials}
			key="depthWrite"
			label="depthWrite"
		/>
		<TransactionalBinding
			objects={materials}
			key="forceSinglePass"
			label="forceSinglePass"
		/>
	</Folder>

	<Folder
		title="stencil"
		expanded={false}
	>
		<TransactionalBinding
			objects={materials}
			key="stencilWrite"
			label="stencilWrite"
		/>
		<TransactionalBinding
			objects={materials}
			key="stencilWriteMask"
			label="stencilWriteMask"
		/>
		<TransactionalBinding
			objects={materials}
			key="stencilFunc"
			label="stencilFunc"
		/>
		<TransactionalBinding
			objects={materials}
			key="stencilRef"
			label="stencilRef"
		/>
		<TransactionalBinding
			objects={materials}
			key="stencilFuncMask"
			label="stencilFuncMask"
		/>
		<TransactionalBinding
			objects={materials}
			key="stencilFail"
			label="stencilFail"
		/>
		<TransactionalBinding
			objects={materials}
			key="stencilZFail"
			label="stencilZFail"
		/>
		<TransactionalBinding
			objects={materials}
			key="stencilZPass"
			label="stencilZPass"
		/>
	</Folder>

	<TransactionalBinding
		objects={materials}
		key="polygonOffset"
		label="polygonOffset"
	/>
	<TransactionalBinding
		objects={materials}
		key="polygonOffsetFactor"
		label="polygonOffsetFactor"
	/>
	<TransactionalBinding
		objects={materials}
		key="polygonOffsetUnits"
		label="polygonOffsetUnits"
	/>
	<TransactionalBinding
		objects={materials}
		key="premultipliedAlpha"
		label="premultipliedAlpha"
	/>
	<TransactionalBinding
		objects={materials}
		key="dithering"
		label="dithering"
	/>

	<TransactionalList
		objects={materials}
		key="side"
		label="side"
		options={{
			FrontSide,
			BackSide,
			DoubleSide,
		}}
	/>
	<!-- <TransactionalBinding
		objects={materials}
		label="side"
		key="side"
	/> -->

	<!-- {#if 'shadowSide' in object}
	<List
		bind:value={object.shadowSide}
		label="shadowSide"
		options={{
			FrontSide: THREE.FrontSide,
			BackSide: THREE.BackSide,
			DoubleSide: THREE.DoubleSide,
		}}
	/>
{/if} -->

	<TransactionalBinding
		objects={materials}
		key="toneMapped"
		label="toneMapped"
	/>

	{#if haveProperty(materials, 'flatShading')}
		<TransactionalBinding
			objects={materials}
			key="flatShading"
			label="flatShading"
		/>
	{/if}

	{#if haveProperty(materials, 'wireframe')}
		<TransactionalBinding
			objects={materials}
			key="wireframe"
			label="wireframe"
		/>
	{/if}

	{#if haveProperty(materials, 'fog')}
		<TransactionalBinding
			objects={materials}
			key="fog"
			label="fog"
		/>
	{/if}

	{#if haveProperty(materials, 'size')}
		<TransactionalBinding
			objects={materials}
			key="size"
			label="size"
		/>
	{/if}
	{#if haveProperty(materials, 'sizeAttenuation')}
		<TransactionalBinding
			objects={materials}
			key="sizeAttenuation"
			label="sizeAttenuation"
		/>
	{/if}

	<TransactionalBinding
		objects={materials}
		key="vertexColors"
		label="vertexColors"
	/>
</Folder>
