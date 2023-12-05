<script lang='ts'>
  import { onDestroy } from 'svelte'
  import { createRawEventDispatcher } from '@threlte/core'
  import type { TpFoldEvent, TpChangeEvent, BladeApi, FolderApi, BladeController, View } from '@tweakpane/core'
  import { setParent, getParent } from './context'

  export let title: string
  export let index: number | undefined = undefined
  export let disabled = false

  const dispatch = createRawEventDispatcher<{
    fold: TpFoldEvent<FolderApi>
    change: TpChangeEvent<unknown, BladeApi<BladeController<View>>>
  }>()

  const folder = getParent()
    .addFolder({ title, index })
    .on('fold', (event) => dispatch('fold', event))
    .on('change', (event) => dispatch('change', event))

  $: folder.disabled = disabled
  $: folder.title = title

  setParent(folder)

  onDestroy(() => folder.dispose())
</script>

<slot />
