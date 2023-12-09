<script lang='ts'>
  import { useThrelte } from '@threlte/core'
  import { onMount } from 'svelte'
  import { Pane, Splitpanes } from 'svelte-splitpanes'
  import Tweakpane from './Tweakpane.svelte'

  const { renderer } = useThrelte()

  let ref: HTMLElement

  onMount(() => {
    const canvas = renderer.domElement
    const oldParent = canvas.parentElement ?? document.body
    ref.replaceWith(canvas)
    return () => oldParent.append(canvas)
  })
</script>

<Splitpanes style="height: 100vh; --tp-base-border-radius: 0px;">
	<Pane minSize={10}>
    <div style='height: 100vh' bind:this={ref} />
  </Pane>

  <Pane minSize={26} size={30}>
    <Tweakpane>
      <slot />
    </Tweakpane>
  </Pane>
</Splitpanes>

<style>
  :global(.tp-rotv) {
    overflow: auto !important;
    max-height: 100dvh !important;
  }
  /* Firefox */
  :global(*) {
    scrollbar-width: thin;
    scrollbar-color: #ABABAB #EBEBEB;
  }

  /* Chrome, Edge and Safari */
  :global(*::-webkit-scrollbar) {
    width: 3px;
    width: 3px;
  }

  :global(*::-webkit-scrollbar-track) {
    border-radius: 0px;
    background-color: #EBEBEB;
  }

  :global(*::-webkit-scrollbar-track:hover) {
    background-color: #C2C2C2;
  }

  :global(*::-webkit-scrollbar-track:active) {
    background-color: #C2C2C2;
  }

  :global(*::-webkit-scrollbar-thumb) {
    border-radius: 2px;
    background-color: #ABABAB;
  }

  :global(*::-webkit-scrollbar-thumb:hover) {
    background-color: #747474;
  }

  :global(*::-webkit-scrollbar-thumb:active) {
    background-color: #525252;
  }
</style>
