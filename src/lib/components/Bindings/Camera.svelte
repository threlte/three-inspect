<script lang="ts">
	import type { PerspectiveCamera, OrthographicCamera } from 'three'
	import { Binding } from 'svelte-tweakpane-ui'

	export let object: PerspectiveCamera | OrthographicCamera

	$: object.updateProjectionMatrix()

	const keys = ['near', 'far', 'zoom'] as const
	const perspectiveKeys = ['fov', 'filmOffset', 'filmGauge'] as const
	const orthographicKeys = ['bottom', 'left', 'top', 'right'] as const
</script>

{#each keys as key (key)}
	<Binding
		bind:object
		{key}
		label={key}
	/>
{/each}

{#if 'isPerspectiveCamera' in object}
	{#each perspectiveKeys as key (key)}
		<Binding
			bind:object
			{key}
			label={key}
		/>
	{/each}
{:else if 'isOrthographicCamera' in object}
	{#each orthographicKeys as key (key)}
		<Binding
			bind:object
			{key}
			label={key}
		/>
	{/each}
{/if}
