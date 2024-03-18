<script lang="ts">
	import type { Object3D, Material } from 'three'
	import { Binding } from 'svelte-tweakpane-ui'

	export let label = 'color'
	export let key = 'color'
	export let object: Object3D | Material

	const options = {
		color: { type: 'float' },
	}

	// @todo add type safety
	$: k = key as keyof object
</script>

<Binding
	bind:object
	key={k}
	{label}
	{options}
/>
