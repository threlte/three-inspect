<script lang='ts'>
  import { createEventDispatcher } from 'svelte'
  import Inspector from './components/inspector.svelte'
  import { storage } from 'trzy'

  const dispatch = createEventDispatcher<{ toggle: boolean }>()

  let enabled = storage.load<boolean>('three-inspect.enabled')

  const handleKeyup = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === 'i') {
      enabled = !enabled
      dispatch('toggle', enabled)
      storage.save('three-inspect.enabled', enabled)
    }
  }
</script>

<svelte:window on:keyup={handleKeyup} />

{#if enabled}
  <Inspector />
{/if}
