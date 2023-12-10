<script lang="ts">
import type * as THREE from 'three'
import { Binding } from 'svelte-tweakpane-ui'

export let object: THREE.PerspectiveCamera | THREE.OrthographicCamera

$: object.updateProjectionMatrix()
</script>

<Binding
	bind:object
	key="near"
	label="near"
/>
<Binding
	bind:object
	key="far"
	label="far"
/>
<Binding
	bind:object
	key="zoom"
	label="zoom"
/>

{#if 'isPerspectiveCamera' in object}
	<Binding
		bind:object
		key="fov"
		label="fov"
	/>
	<Binding
		bind:object
		key="filmOffset"
		label="filmOffset"
	/>
	<Binding
		bind:object
		key="filmGauge"
		label="filmGauge"
	/>
{:else if 'isOrthographicCamera' in object}
	<Binding
		bind:object
		key="bottom"
		label="bottom"
	/>
	<Binding
		bind:object
		key="left"
		label="left"
	/>
	<Binding
		bind:object
		key="right"
		label="right"
	/>
	<Binding
		bind:object
		key="top"
		label="top"
	/>
{/if}
