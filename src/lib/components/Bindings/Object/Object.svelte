<script lang='ts'>
  import * as THREE from 'three'
  import { Folder, Binding } from 'svelte-tweakpane-ui'
  import Transform from '../Transform/Transform.svelte'
  import Material from '../Material/Material.svelte'
  import Misc from './Misc.svelte'
  import TransformControls from './TransformControls.svelte'
  
  export let object: THREE.Object3D

  $: isAmbient = 'isAmbientLight' in object
</script>

<Binding bind:object key='visible' label='visible' />

{#if isAmbient === false}
  <Transform {object} />
  <Binding bind:object key='castShadow' label='castShadow' />
{/if}

{#if ('isLight' in object) === false}
  <Binding bind:object key='receiveShadow' label='receiveShadow' />
{/if}

{#if object instanceof THREE.Mesh && object.material instanceof THREE.Material}
  <Folder title={`${object.material.name} (${object.material.type})`.trim()}>
    <Material object={object.material} />
  </Folder>
{/if}

<Misc {object} />

<TransformControls {object} />
