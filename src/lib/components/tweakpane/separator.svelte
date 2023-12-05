<script lang='ts'>
  import { onMount } from 'svelte'
  import { getParent } from './context'

  const separator = getParent()

  onMount(() => {
    separator.addBlade({ view: 'separator' })
    return () => separator.dispose()
  })
</script>
