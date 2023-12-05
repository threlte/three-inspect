<script lang='ts'>
  import * as THREE from 'three'
  import { useBinding, useSeparator } from '$lib/components/tweakpane'
  import FlatShading from './FlatShading.svelte'
  import Wireframe from './Wireframe.svelte'
  import Fog from './Fog.svelte'
  import Points from './Points.svelte'

  export let object: THREE.Material

  useSeparator()
  useBinding({ label: 'vertexColors', object })
</script>

{#if 'flatShading' in object}
  <FlatShading {object} />
{/if}

{#if 'wireframe' in object}
  <Wireframe {object} />
{/if}

{#if object instanceof THREE.PointsMaterial === false}
  <Fog {object} />
{:else}
  <Points {object} />
{/if}

<!-- <RadioGrid
  key='side'
  {object}
  options={[
    ['Back', THREE.BackSide],
    ['Double', THREE.DoubleSide],
    ['Front', THREE.FrontSide],
  ]}
/> -->
