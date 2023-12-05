<script lang='ts'>
  import { T } from '@threlte/core'
  import { Grid } from '@threlte/extras'
  import { useBinding } from '$lib/components/tweakpane'
  import { AxesHelper } from 'trzy'
  import Fog from './Fog.svelte'
  import Background from './Background.svelte'
  import { persisted } from '$lib/internal/persisted'

  export let object: THREE.Scene
  
  let ref: THREE.Mesh

  let grid = persisted('grid', true)
  let gridColor = persisted('gridColor', '#ddd')
  let axes = persisted('axes', true)

  const toggleGrid = () => ($grid = !$grid)
  const toggleAxes = () => ($axes = !$axes)
  const setGridColor = () => { }

  useBinding({ label: 'grid', value: $grid, onChange: toggleGrid })
  useBinding({ label: 'grid color', value: $gridColor, onChange: setGridColor })
  useBinding({ label: 'axes', value: $axes, onChange: toggleAxes })
</script>

{#if object.background}
  <Background {object} />
{/if}

{#if object.fog}
  <Fog object={object.fog} />
{/if}

<Grid
  bind:ref
  infiniteGrid
  visible={$grid}
  name='THREE Inspect Grid'
  cellSize={1}
  renderOrder={9999}
  userData.threeInspectHide
  sectionColor='#555'
/>

<T
  is={AxesHelper}
  visible={$axes}
  name='THREE Inspect Axes'
  length={1000}
  width={0.2}
  userData.threeInspectHide
/>
