<script lang='ts'>
  import type * as THREE from 'three'
  import { T } from '@threlte/core'
  import { Binding, Folder, List, type ListOptions } from 'svelte-tweakpane-ui'
  import Camera from '../Camera/Camera.svelte'

  export let object: THREE.LightShadow

  let options: ListOptions<number> = {
    128: 128,
    256: 256,
    512: 512,
    1024: 1024,
    2048: 2048,
    4096: 4096
  }

  let mapSize = object.mapSize.width

  $: {
    object.mapSize.width = mapSize
    object.mapSize.height = mapSize
    object.dispose()
    object.map = null
  }

  $: camera = object.camera as THREE.PerspectiveCamera | THREE.OrthographicCamera
</script>

<List bind:value={mapSize} label='mapSize' {options} />
<Binding bind:object key='autoUpdate' label='autoUpdate' />
<Binding bind:object key='bias' label='bias' />
<Binding bind:object key='blurSamples' label='blurSamples' />
<Binding bind:object key='normalBias' label='normalBias' />
<Binding bind:object key='radius' label='radius' />

{#if 'isPerspectiveCamera' in camera || 'isOrthographicCamera' in camera}
  <Folder title='shadow camera'>
    <Camera object={camera} />
  </Folder>
{/if}

<T.CameraHelper
  args={[camera]}
  userData.threeInspectHide
/>
