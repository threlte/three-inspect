<script lang="ts">
	import type { LightShadow, PerspectiveCamera, OrthographicCamera } from 'three'
	import { Binding, Folder, List } from 'svelte-tweakpane-ui'
	import Camera from './Camera.svelte'

	export let object: LightShadow

	let mapSize = object.mapSize.width

	$: {
		object.mapSize.width = mapSize
		object.mapSize.height = mapSize
		object.dispose()
		object.map = null
	}

	$: camera = object.camera as PerspectiveCamera | OrthographicCamera

	const keys = ['autoUpdate', 'bias', 'blurSamples', 'normalBias', 'radius'] as const
</script>

<List
	bind:value={mapSize}
	label="mapSize"
	options={{
		128: 128,
		256: 256,
		512: 512,
		1024: 1024,
		2048: 2048,
		4096: 4096,
	}}
/>

{#each keys as key (key)}
	<Binding
		bind:object
		{key}
		label={key}
	/>
{/each}

{#if 'isPerspectiveCamera' in camera || 'isOrthographicCamera' in camera}
	<Folder
		title="shadow camera"
		expanded={false}
	>
		<Camera object={camera} />
	</Folder>
{/if}
