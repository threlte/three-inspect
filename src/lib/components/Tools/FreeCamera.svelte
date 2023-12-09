<script lang='ts'>
  import type * as THREE from 'three'
  import { onMount } from 'svelte'
  import { T, useThrelte } from '@threlte/core'
  import CameraControls from '../Internal/CameraControls.svelte'

  const { camera } = useThrelte()

  let ref: THREE.PerspectiveCamera
  let ready = false

  onMount(() => {
    const lastCamera = camera.current
    ready = true

    return () => {
      camera.set(lastCamera)
    }
  })
</script>

{#if ready}
  <T.PerspectiveCamera
    bind:ref
    makeDefault
    fov={50}
    position={[1, 1, 1]}
    on:create={({ ref }) => ref.lookAt(0, 0, 0)}
  >
    <CameraControls camera={ref} />
  </T.PerspectiveCamera>
{/if}
