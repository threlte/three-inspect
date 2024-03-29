<script lang="ts">
	import {
		type Material,
		Texture,
		MeshBasicMaterial,
		MeshLambertMaterial,
		MeshPhongMaterial,
		MeshToonMaterial,
		MeshMatcapMaterial,
		MeshStandardMaterial,
	} from 'three'
	import { Binding, Image, Point } from 'svelte-tweakpane-ui'

	export let object: Material
</script>

{#if object instanceof MeshBasicMaterial || object instanceof MeshLambertMaterial || object instanceof MeshPhongMaterial}
	{#if object.specularMap}
		<Image
			bind:value={object.specularMap.image.src}
			fit="cover"
			label="specularMap"
		/>
	{/if}
{/if}

{#if object instanceof MeshMatcapMaterial}
	{#if object.matcap}
		<Image
			bind:value={object.matcap.image.src}
			fit="cover"
			label="matcap"
		/>
	{/if}
{/if}

{#if object instanceof MeshBasicMaterial || object instanceof MeshLambertMaterial || object instanceof MeshPhongMaterial || object instanceof MeshStandardMaterial || object instanceof MeshMatcapMaterial || object instanceof MeshToonMaterial}
	{#if object.map}
		<Image
			bind:value={object.map.image.src}
			fit="cover"
			label="map"
		/>
	{/if}

	{#if object.alphaMap}
		<Image
			bind:value={object.alphaMap.image.src}
			fit="cover"
			label="alphaMap"
		/>
	{/if}
{/if}

{#if object instanceof MeshLambertMaterial || object instanceof MeshPhongMaterial || object instanceof MeshStandardMaterial || object instanceof MeshMatcapMaterial || object instanceof MeshToonMaterial}
	{#if object.normalMap}
		<Image
			bind:value={object.normalMap.image.src}
			fit="cover"
			label="normalMap"
		/>
		<Binding
			bind:object
			key="normalMapType"
			label="normalMapType"
		/>
		<Point bind:value={object.normalScale} />
	{/if}
{/if}

{#if 'envMap' in object && object.envMap instanceof Texture}
	<Image
		bind:value={object.envMap.image.src}
		fit="cover"
		label="envMap"
	/>
{/if}

{#if object instanceof MeshBasicMaterial || object instanceof MeshLambertMaterial || object instanceof MeshPhongMaterial || object instanceof MeshStandardMaterial || object instanceof MeshToonMaterial}
	{#if object.aoMap}
		<Image
			bind:value={object.aoMap.image.src}
			fit="cover"
			label="alphaMap"
		/>
		<Binding
			bind:object
			key="aoMapIntensity"
			label="aoMapIntensity"
		/>
	{/if}

	{#if object.lightMap}
		<Image
			bind:value={object.lightMap.image.src}
			fit="cover"
			label="lightMap"
		/>
		<Binding
			bind:object
			key="lightMapIntensity"
			label="lightMapIntensity"
		/>
	{/if}
{/if}

{#if object instanceof MeshLambertMaterial || object instanceof MeshStandardMaterial || object instanceof MeshToonMaterial}
	{#if object.bumpMap}
		<Image
			bind:value={object.bumpMap.image.src}
			fit="cover"
			label="bumpMap"
		/>
		<Binding
			bind:object
			key="bumpScale"
			label="bumpScale"
		/>
	{/if}

	{#if object.displacementMap}
		<Image
			bind:value={object.displacementMap.image.src}
			fit="cover"
			label="displacementMap"
		/>
		<Binding
			bind:object
			key="displacementScale"
			label="displacementScale"
		/>
		<Binding
			bind:object
			key="displacementBias"
			label="displacementBias"
		/>
	{/if}

	{#if object.emissiveMap}
		<Image
			bind:value={object.emissiveMap.image.src}
			fit="cover"
			label="emissiveMap"
		/>
		<Binding
			bind:object
			key="emissiveIntensity"
			label="emissiveIntensity"
		/>
	{/if}
{/if}

{#if object instanceof MeshToonMaterial}
	{#if object.gradientMap}
		<Image
			bind:value={object.gradientMap.image.src}
			fit="cover"
			label="gradientMap"
		/>
	{/if}
{/if}

{#if object instanceof MeshStandardMaterial}
	{#if object.metalnessMap}
		<Image
			bind:value={object.metalnessMap.image.src}
			fit="cover"
			label="metalnessMap"
		/>
	{/if}

	{#if object.roughnessMap}
		<Image
			bind:value={object.roughnessMap.image.src}
			fit="cover"
			label="roughnessMap"
		/>
	{/if}
{/if}
