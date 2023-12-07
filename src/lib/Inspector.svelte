<script lang='ts'>
  import { createEventDispatcher } from 'svelte'
  import Inspector from './components/inspector.svelte'
  import { persisted } from './internal/persisted'

  const dispatch = createEventDispatcher<{ toggle: boolean }>()

  let enabled = persisted('three-inspect.enabled', true)

  const handleKeyup = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === 'i') {
      $enabled = !$enabled
      dispatch('toggle', $enabled)
    }
  }
</script>

<svelte:window on:keyup={handleKeyup} />

{#if $enabled}
  <Inspector />
{/if}
