<script lang="ts">
  import { T } from '@threlte/core'
  import Env from './Env.svelte'
  import Stones from './Stones.svelte'
</script>

<!-- SKY -->
<Env />

<!-- CAMERA -->
<T.PerspectiveCamera
  position={[0, 3, 20]}
  makeDefault
/>

<!-- LIGHTS -->
<T.DirectionalLight />

<Stones />

<!-- GROUND -->
<T.Mesh>
  <T.CylinderGeometry args={[17, 17, 1, 100, 1]} />
  <T.MeshStandardMaterial />
</T.Mesh>
