<script lang='ts'>
  import * as THREE from 'three'
  import { T } from '@threlte/core'
  import { Grid } from '@threlte/extras'
  import { Separator } from 'svelte-tweakpane-ui'
  import { AxesHelper } from 'trzy'
  import { persisted } from '../../internal/persisted'
  import { getInternalContext } from '../../internal/context'
  import Camera from './Camera/Camera.svelte'
  import Light from './Light/Light.svelte'
  import Scene from './Scene/Scene.svelte'
  import Object from './Object/Object.svelte'

  const { selectedObject } = getInternalContext()

  let grid = persisted('grid', true)
  let axes = persisted('axes', true)

  $: object = $selectedObject
</script>

{#if object !== undefined}
  <Separator />
{/if}

{#if object instanceof THREE.PerspectiveCamera || object instanceof THREE.OrthographicCamera}
  <Camera {object} />
{:else if object instanceof THREE.Light}
  <Light {object} />
{:else if object instanceof THREE.Scene}
  <Scene {object} />
{:else if object instanceof THREE.Object3D}
  <Object {object} />
{/if}

<Grid
  infiniteGrid
  visible={$grid}
  cellSize={1}
  renderOrder={9999}
  sectionColor='#555'
/>

<T
  is={AxesHelper}
  visible={$axes}
  length={1000}
  width={0.2}
/>
