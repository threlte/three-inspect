<script lang='ts'>
  import * as THREE from 'three'
  import { Binding } from 'svelte-tweakpane-ui'
  import Physical from './Physical.svelte'
  import Misc from './Misc.svelte'
  import Color from './Color.svelte'
  
  export let object: THREE.Material
</script>

<Binding bind:object key='visible' label='visible' />
<Binding bind:object key='transparent' label='transparent' options={{ onChange() { object.needsUpdate = true } }} />
<Binding bind:object key='opacity' label='opacity' options={{ min: 0, max: 1 }} />

{#if 'color' in object}
  <Color label='color' {object} />
{/if}

{#if
  object instanceof THREE.MeshLambertMaterial ||
  object instanceof THREE.MeshPhongMaterial ||
  object instanceof THREE.MeshStandardMaterial
}
  <Binding bind:object key='emissive' label='emissive' />
  <Binding bind:object key='emissiveIntensity' label='emissiveIntensity' options={{ min: 0 }} />
{/if}

{#if
  object instanceof THREE.MeshBasicMaterial ||
  object instanceof THREE.MeshLambertMaterial ||
  object instanceof THREE.MeshPhongMaterial
}
  <Binding bind:object key='reflectivity' label='reflectivity' options={{ min: 0, max: 1 }} />
  <Binding bind:object key='refractionRatio' label='refractionRatio' options={{ min: 0, max: 1 }} />

  {#if object instanceof THREE.MeshPhongMaterial}
    <Binding bind:object key='shininess' label='shininess' options={{ min: 0, max: 1 }} />
  {/if}
{:else if object instanceof THREE.MeshStandardMaterial}
  <Binding bind:object key='roughness' label='roughness' options={{ min: 0, max: 1 }} />
  <Binding bind:object key='metalness' label='metalness' options={{ min: 0, max: 1 }} />

  {#if object instanceof THREE.MeshPhysicalMaterial}
    <Physical {object} />
  {/if}
{/if}

<Misc {object} />
