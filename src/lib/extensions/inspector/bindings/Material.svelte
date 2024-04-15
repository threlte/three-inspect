<script lang="ts">
	import { Folder } from 'svelte-tweakpane-ui'
	import type { Material, Object3D } from 'three'
	import TransactionalBinding from './TransactionalBinding.svelte'
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
</Folder>
