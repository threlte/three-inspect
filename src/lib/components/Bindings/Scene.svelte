<script lang="ts">
	import { type Scene, type Fog, Texture } from 'three'
	import { Binding, Separator, Image } from 'svelte-tweakpane-ui'
	import Color from './Color.svelte'
	import { persisted } from '../../internal/persisted'

	export let object: Scene

	const grid = persisted('grid', true)
	const gridColor = persisted('gridColor', '#ddd')
	const axes = persisted('axes', true)

	let params = {
		grid: $grid,
		gridColor: $gridColor,
		axes: $axes,
	}

	$: $grid = params.grid
	$: $gridColor = params.gridColor
	$: $axes = params.axes

	$: fog = object.fog as Fog
</script>

<Binding
	bind:object={params}
	key="grid"
	label="grid"
/>
<Binding
	bind:object={params}
	key="gridColor"
	label="gridColor"
/>
<Binding
	bind:object={params}
	key="axes"
	label="axes"
/>

{#if object.background}
	<Separator />

	<Binding
		bind:object
		key="backgroundBlurriness"
		label="backgroundBlurriness"
	/>
	<Binding
		bind:object
		key="backgroundIntensity"
		label="backgroundIntensity"
	/>

	{#if 'isColor' in object.background}
		<Color
			key="background"
			label="background"
			{object}
		/>
	{:else if object.background instanceof Texture}
		<Image
			bind:value={object.background.image.src}
			fit="cover"
			label="background"
		/>
	{/if}

	{#if object.environment}
		<Image
			bind:value={object.environment.image.src}
			fit="cover"
			label="environment"
		/>
	{/if}
{/if}

{#if fog}
	<Separator />

	<Binding
		bind:object={fog}
		key="color"
		label="color"
	/>
	<Binding
		bind:object={fog}
		key="near"
		label="near"
	/>
	<Binding
		bind:object={fog}
		key="far"
		label="far"
	/>
{/if}
