<script lang="ts">
	import type * as THREE from 'three'
	import { Binding, Folder, List } from 'svelte-tweakpane-ui'
	import Camera from './Camera.svelte'

	export let object: THREE.LightShadow

	let mapSize = object.mapSize.width

	$: {
		object.mapSize.width = mapSize
		object.mapSize.height = mapSize
		object.dispose()
		object.map = null
	}

	$: camera = object.camera as THREE.PerspectiveCamera | THREE.OrthographicCamera
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

<Binding
	bind:object
	key="autoUpdate"
	label="autoUpdate"
/>
<Binding
	bind:object
	key="bias"
	label="bias"
/>
<Binding
	bind:object
	key="blurSamples"
	label="blurSamples"
/>
<Binding
	bind:object
	key="normalBias"
	label="normalBias"
/>
<Binding
	bind:object
	key="radius"
	label="radius"
/>

{#if 'isPerspectiveCamera' in camera || 'isOrthographicCamera' in camera}
	<Folder
		title="shadow camera"
		expanded={false}
	>
		<Camera object={camera} />
	</Folder>
{/if}
