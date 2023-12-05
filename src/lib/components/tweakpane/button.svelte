<script lang="ts">
  import { onMount } from 'svelte'
  import type { TpEvent } from '@tweakpane/core'
  import { createRawEventDispatcher } from '@threlte/core'
  import { getParent } from './context'

  export let title: string
  export let index: number | undefined = undefined

  const dispatch = createRawEventDispatcher<{ click: TpEvent }>()
  const button = getParent()

  onMount(() => {
    button
      .addButton({ title, index })
      .on('click', (event) => dispatch('click', event))
    return () => button.dispose()
  })
</script>
