<script lang='ts'>
  import { useInspector } from '../internal/context'
  import Draggable from './Positions/Draggable.svelte'
  import Inline from './Positions/Inline.svelte'

  const { position } = useInspector()
</script>

{#if $position === 'draggable'}
  <Draggable />
{:else if $position === 'inline'}
  <Inline />
{/if}
