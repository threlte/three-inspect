<script lang='ts'>
  import * as THREE from 'three'
  import { T } from '@threlte/core'
  import { Grid } from '@threlte/extras'
  import { AxesHelper } from 'trzy'
  import { useSelectedObject } from '$lib/hooks/use-selected-item'
  import Camera from './Camera/Camera.svelte'
  import Light from './Light/Light.svelte'
  import Scene from './Scene/Scene.svelte'
  import Object from './Object/Object.svelte'
  import { persisted } from '$lib/internal/persisted'

  const { selectedObject } = useSelectedObject()

  let grid = persisted('grid', true)
  let axes = persisted('axes', true)
</script>

{#if $selectedObject instanceof THREE.PerspectiveCamera || $selectedObject instanceof THREE.OrthographicCamera}
  <Camera object={$selectedObject} />
{:else if $selectedObject instanceof THREE.Light}
  <Light object={$selectedObject} />
{:else if $selectedObject instanceof THREE.Scene}
  <Scene object={$selectedObject} />
{:else if $selectedObject instanceof THREE.Object3D}
  <Object object={$selectedObject} />
{/if}

<Grid
  infiniteGrid
  visible={$grid}
  name='THREE Inspect Grid'
  cellSize={1}
  renderOrder={9999}
  sectionColor='#555'
  userData.threeInspectHide
/>

<T
  is={AxesHelper}
  visible={$axes}
  name='THREE Inspect Axes'
  length={1000}
  width={0.2}
  userData.threeInspectHide
/>
