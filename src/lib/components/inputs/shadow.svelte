<script lang='ts'>
  import * as THREE from 'three'
  import { T } from '@threlte/core'
  import { useBinding, Folder } from '$lib/components/tweakpane'
  import Camera from './Camera/Camera.svelte'

  export let object: THREE.LightShadow

  const onChange = () => {
    object.mapSize.width = $mapSize
    object.mapSize.height = $mapSize
    object.dispose()
    object.map = null
  }

  const mapSize = useBinding({
    label: 'mapSize',
    value: object.mapSize.x,
    params: { options: { 256: 256, 512: 512, 1024: 1024, 2048: 2048, 4096: 4096 } },
    onChange
  })

  useBinding({ label: 'autoUpdate', object })
  useBinding({ label: 'bias', object })
  useBinding({ label: 'blurSamples', object })
  useBinding({ label: 'normalBias', object })
  useBinding({ label: 'radius', object })

  $: camera = object.camera
</script>

{#if camera instanceof THREE.PerspectiveCamera || camera instanceof THREE.OrthographicCamera}
  <Folder title='Shadow camera'>
    <Camera object={camera} enableControls={false} />
  </Folder>
{/if}

<T.CameraHelper
  args={[camera]}
  userData.threeInspectHide
/>
