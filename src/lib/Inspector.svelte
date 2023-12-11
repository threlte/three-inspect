<script lang="ts">
	import App from './components/App.svelte'
	import { persisted } from './internal/persisted'
	import { setPublicContext, setInternalContext } from './internal/context'

	export let position: 'draggable' | 'inline' = 'inline'

	const enabled = persisted('enabled', true)

	setPublicContext({ position })
	setInternalContext()

	const handleKeyup = (event: KeyboardEvent) => {
		if (event.key.toLowerCase() === 'i') {
			$enabled = !$enabled
		}
	}
</script>

<svelte:window on:keyup={handleKeyup} />

{#if $enabled}
	{#if $$slots.default}
		<App><slot /></App>
	{:else}
		<App />
	{/if}
{/if}
