<script lang='ts'>
  import { Binding } from 'svelte-tweakpane-ui'
  import Fog from './Fog.svelte'
  import Background from './Background.svelte'
  import { persisted } from '$lib/internal/persisted'

  export let object: THREE.Scene
  
  let grid = persisted('grid', true)
  let gridColor = persisted('gridColor', '#ddd')
  let axes = persisted('axes', true)

  let params = {
    grid: $grid,
    gridColor: $gridColor,
    axes: $axes,
  }

  $: $grid = params.grid
  $: $gridColor = params.gridColor
  $: $axes = params.axes

  $: fog = object.fog as THREE.Fog
</script>

<Binding bind:object={params} key='grid' label='grid' />
<Binding bind:object={params} key='gridColor' label='gridColor' />
<Binding bind:object={params} key='axes' label='axes' />

{#if object.background}
  <Background {object} />
{/if}

{#if fog}
  <Fog object={fog} />
{/if}
