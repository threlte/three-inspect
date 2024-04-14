<script lang="ts">
	import type { Material } from 'three'
	import TransactionalBinding from './TransactionalBinding.svelte'
	import { haveProperty } from './utils'

	type Props = {
		materials: Material[]
	}

	let { materials }: Props = $props()
</script>

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
