<script lang='ts'>
  import * as THREE from 'three'
  import { Binding, Folder } from 'svelte-tweakpane-ui'
  import Color from '../Material/Color.svelte'
  import Object3D from '../Object/Object.svelte'
  import Shadow from '../Object/Shadow.svelte'
  import Directional from './Directional.svelte'
  import Hemisphere from './Hemisphere.svelte'
  import Point from './Point.svelte'
  import Spot from './Spot.svelte'
  import RectArea from './RectArea.svelte'

  export let object: THREE.Light
</script>

<Binding bind:object key='intensity' label='intensity' options={{ step: 0.05 }} />

<Color key='color' {object} />

{#if object instanceof THREE.DirectionalLight}
  <Directional {object} />
{:else if object instanceof THREE.HemisphereLight}
  <Hemisphere {object} />
{:else if object instanceof THREE.PointLight}
  <Point {object} />
{:else if object instanceof THREE.SpotLight}
  <Spot {object} />
{:else if object instanceof THREE.RectAreaLight}
  <RectArea {object} />
{/if}

<Object3D {object} />

{#if object.shadow}
  <Folder disabled={!object.castShadow} title='shadow'>
    <Shadow object={object.shadow} />
  </Folder>
{/if}
