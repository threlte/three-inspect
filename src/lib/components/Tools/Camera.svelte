<script lang='ts'>
  import { T } from '@threlte/core'
  import CameraControls from '../Internal/CameraControls.svelte'
</script>

<T.PerspectiveCamera
  makeDefault
  fov={50}
  position={[1, 1, 1]}
  on:create={({ ref }) => ref.lookAt(0, 0, 0)}
>
  <CameraControls />
</T.PerspectiveCamera>
