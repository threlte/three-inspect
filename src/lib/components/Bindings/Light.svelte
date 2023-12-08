<script lang='ts'>
  import * as THREE from 'three'
  import { Binding, Folder } from 'svelte-tweakpane-ui'
  import Color from './Color.svelte'
  import Object3D from './Object.svelte'
  import Shadow from './Shadow.svelte'

  export let object: THREE.Light
</script>

<Color key='color' {object} />
<Binding bind:object key='intensity' label='intensity' options={{ step: 0.05 }} />

{#if object instanceof THREE.DirectionalLight}
  <Binding bind:object={object.target} key='position' label='target' />

{:else if object instanceof THREE.PointLight}
  <Binding bind:object key='decay' label='decay' />
  <Binding bind:object key='distance' label='distance' />
  <Binding bind:object key='power' label='power' />

{:else if object instanceof THREE.SpotLight}
  <Binding bind:object={object.target} key='position' label='target' />
  <Binding bind:object key='angle' label='angle' options={{ min: 0, max: Math.PI / 2 }} />
  <Binding bind:object key='decay' label='decay' />
  <Binding bind:object key='distance' label='distance' />
  <Binding bind:object key='penumbra' label='penumbra' options={{ min: 0, max: 1 }} />
  <Binding bind:object key='power' label='power' />
  <Binding bind:object key='position' label='position' />

{:else if object instanceof THREE.HemisphereLight}
  <Binding bind:object key='groundColor' label='groundColor'/>

{:else if object instanceof THREE.RectAreaLight}
  <Binding bind:object key='power' label='power' />
  <Binding bind:object key='width' label='width' />
  <Binding bind:object key='height' label='height' />

{/if}

<Object3D {object} />

{#if object.shadow}
  <Folder disabled={!object.castShadow} title='shadow'>
    <Shadow object={object.shadow} />
  </Folder>
{/if}

<!-- @TODO: target and transform controls -->
