<script lang="ts">
	import { Separator } from 'svelte-tweakpane-ui'
	import * as THREE from 'three'
	import SerializedBinding from '../SerializedBinding.svelte'
	import Instance from './Instance.svelte'

	export let object: THREE.Object3D
</script>

<SerializedBinding
	bind:object
	key="position"
	label="position"
/>
<SerializedBinding
	bind:object
	key="rotation"
	label="rotation"
/>
<SerializedBinding
	bind:object
	key="scale"
	label="scale"
/>

{#if object instanceof THREE.InstancedMesh}
	<Separator />
	<Instance {object} />
{/if}
