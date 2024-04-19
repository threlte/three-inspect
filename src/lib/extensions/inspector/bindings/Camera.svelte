<script lang="ts">
	import type { OrthographicCamera, PerspectiveCamera } from 'three'
	import TransactionalBinding from './TransactionalBinding.svelte'
	import { areOfType } from './utils'

	type Props = {
		objects: (PerspectiveCamera | OrthographicCamera)[]
	}

	let { objects }: Props = $props()

	const keys = ['near', 'far', 'zoom'] as const
	const perspectiveKeys = ['fov', 'filmOffset', 'filmGauge'] as const
	const orthographicKeys = ['bottom', 'left', 'top', 'right'] as const
</script>

{#each keys as key (key)}
	<TransactionalBinding
		{objects}
		{key}
		label={key}
		on:change={() => {
			objects.forEach((object) => {
				object.updateProjectionMatrix()
			})
		}}
	/>
{/each}

{#if areOfType(objects, 'isPerspectiveCamera')}
	{#each perspectiveKeys as key (key)}
		<TransactionalBinding
			{objects}
			{key}
			label={key}
			on:change={() => {
				objects.forEach((object) => {
					object.updateProjectionMatrix()
				})
			}}
		/>
	{/each}
{:else if areOfType(objects, 'isOrthographicCamera')}
	{#each orthographicKeys as key (key)}
		<TransactionalBinding
			{objects}
			{key}
			label={key}
			on:change={() => {
				objects.forEach((object) => {
					object.updateProjectionMatrix()
				})
			}}
		/>
	{/each}
{/if}
