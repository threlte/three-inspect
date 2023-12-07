<script lang='ts'>
  import * as THREE from 'three'
  import { Folder, Binding, Textarea, Separator } from 'svelte-tweakpane-ui'
  import Transform from '../Transform/Transform.svelte'
  import Material from '../Material/Material.svelte'
  import TransformControls from './TransformControls.svelte'
  
  export let object: THREE.Object3D

  $: isAmbientLight = 'isAmbientLight' in object
  $: userData = JSON.stringify(object.userData)
</script>

<Binding bind:object key='visible' label='visible' />

{#if isAmbientLight === false}
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

{#if object.customDepthMaterial !== undefined}
  <Folder title={`${object.customDepthMaterial.name} (CustomDepthMaterial)`.trim()}>
    <Material object={object.customDepthMaterial} />
  </Folder>
{/if}

<Binding bind:object key='frustumCulled' label='frustumCulled' />
<Binding bind:object key='matrixAutoUpdate' label='matrixAutoUpdate' />
<Binding bind:object key='matrixWorldAutoUpdate' label='matrixWorldAutoUpdate' />
<Binding bind:object key='renderOrder' label='renderOrder' options={{ step: 1 }} />
<Separator />
<Textarea bind:value={userData} label='userData' disabled rows={5} />

<TransformControls {object} />
