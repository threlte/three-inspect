<script lang='ts'>
  import * as THREE from 'three'
  import { useBinding, Folder } from '$lib/components/tweakpane'
  import Object3D from '../Object/Object.svelte'
  import Shadow from '../shadow.svelte'
  import Color from '../color.svelte'
  import { useDocs } from '$lib/hooks/docs'
  import Directional from './Directional.svelte'
  import Hemisphere from './Hemisphere.svelte'
  import Point from './Point.svelte'
  import Spot from './Spot.svelte'
  import RectArea from './RectArea.svelte';
  
  export let object: THREE.Light
  
  $: lightDocs = useDocs('lights', 'Light')
  // $: docs = useDocs('lights', object.type)
  
  // const link = (key: string) => docs(key)
  const linkLight = (key: string) => lightDocs(key)

  useBinding({ label: 'intensity', object, params: { step: 0.05 } })
</script>

<Object3D {object} />

<Color label='color' {object} link={linkLight} />

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

{#if object.shadow}
  <Folder disabled={!object.castShadow} title='Shadow'>
    <Shadow object={object.shadow} />
  </Folder>
{/if}
