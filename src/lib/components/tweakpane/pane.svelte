<script lang="ts">
  import { setPane, setParent } from './context'
  import { onDestroy, onMount } from 'svelte'
  import { Pane, type TpPluginBundle } from 'tweakpane'
  import { createRawEventDispatcher } from '@threlte/core'
  import Themes from './themes.svelte'
  import type { FolderApi, BladeApi, BladeController, View, TpChangeEvent, TpFoldEvent } from '@tweakpane/core'
  import * as EssentialsPlugin from '@tweakpane/plugin-essentials'

  export let title: string | undefined = undefined
  export let plugins: TpPluginBundle[] = []
  export let theme: 'auto' | 'retro' | 'light' | 'dark' = 'auto'
  export let fixed = false

  // type T = $$Generic

  let container: HTMLElement

  const dispatch = createRawEventDispatcher<{
    fold: TpFoldEvent<FolderApi>
    change: TpChangeEvent<unknown, BladeApi<BladeController<View>>>
  }>()

  const pane = setPane(new Pane(title ? { title } : undefined))
  pane.on('fold', (event) => dispatch('fold', event))
  pane.on('change', (event) => dispatch('change', event))
  pane.registerPlugin(EssentialsPlugin)
  plugins.forEach((plugin) => pane.registerPlugin(plugin))

  pane.controller.view.buttonElement.hidden = true;
  setParent(pane)

  $: pane.element.style.cssText = $$restProps.style
  $: pane.element.className += $$restProps.class

  onMount(() => {
    if (fixed) return
    container.replaceWith(pane.element)
  })

  onDestroy(() => pane.dispose())
</script>

<div bind:this={container} />

<slot />

<Themes {theme} />
