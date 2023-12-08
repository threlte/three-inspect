<script lang='ts'>
  import { onMount } from 'svelte'
  import { T } from '@threlte/core'
  import CameraControls from '../Internal/CameraControls.svelte'
  import { getInternalContext } from '$lib/internal/context'

  const { camera } = getInternalContext()

  let ready = false

  onMount(() => {
    const lastCamera = camera.current
    ready = true
    return () => camera.set(lastCamera)
  })
</script>

{#if ready}
  <T.PerspectiveCamera
    makeDefault
    fov={50}
    position={[1, 1, 1]}
    on:create={({ ref }) => ref.lookAt(0, 0, 0)}
    let:ref
  >
    <CameraControls camera={ref} />
  </T.PerspectiveCamera>
{/if}
