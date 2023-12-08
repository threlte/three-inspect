<script lang='ts'>
  import { getInternalContext } from '../../internal/context'
  import Object from './Object.svelte'

  const { selectedObject } = getInternalContext()

  $: object = $selectedObject
</script>

{#if object !== undefined}
  <Object {object} />
{/if}
