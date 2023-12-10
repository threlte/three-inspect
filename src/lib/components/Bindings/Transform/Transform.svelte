<script lang="ts">
	import * as THREE from 'three'
	import { useTask } from '@threlte/core'
	import { Binding, Separator, type BindingRef } from 'svelte-tweakpane-ui'
	import Instance from './Instance.svelte'

	export let object: THREE.Object3D

	const refs: BindingRef[] = []

	useTask(() => {
		for (const ref of refs) ref.refresh()
	})
</script>

<Binding
	bind:ref={refs[0]}
	bind:object
	key="position"
	label="position"
/>
<Binding
	bind:ref={refs[1]}
	bind:object
	key="rotation"
	label="rotation"
/>
<Binding
	bind:ref={refs[2]}
	bind:object
	key="scale"
	label="scale"
/>

{#if object instanceof THREE.InstancedMesh}
	<Separator />
	<Instance {object} />
{/if}
