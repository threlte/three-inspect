<script lang='ts'>
  import { onMount } from 'svelte'

  let ref: HTMLElement

  onMount(() => {
    document.body.append(ref)
    return () => ref.remove()
  })
</script>

<div bind:this={ref}>
  <slot />
</div>

<style>
  div {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
</style>
