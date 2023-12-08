<script lang='ts'>
  import * as THREE from 'three'
  import { Separator } from 'svelte-tweakpane-ui'
  import { getInternalContext } from '../../internal/context'
  import Camera from './Camera.svelte'
  import Light from './Light.svelte'
  import Scene from './Scene.svelte'
  import Object from './Object.svelte'

  const { selectedObject } = getInternalContext()

  $: object = $selectedObject
</script>

{#if object !== undefined}
  <Separator />

  {#if object instanceof THREE.PerspectiveCamera || object instanceof THREE.OrthographicCamera}
    <Camera {object} />
  {:else if object instanceof THREE.Light}
    <Light {object} />
  {:else if object instanceof THREE.Scene}
    <Scene {object} />
  {:else if object instanceof THREE.Object3D}
    <Object {object} />
  {/if}
{/if}
