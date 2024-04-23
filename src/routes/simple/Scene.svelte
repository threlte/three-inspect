<script lang="ts">
  import { T } from '@threlte/core'
  import { RoundedBoxGeometry } from '@threlte/extras'
</script>

<!-- CAMERA -->
<T.PerspectiveCamera
  position={[0, 0, 10]}
  makeDefault
/>

<!-- LIGHTS -->
<T.DirectionalLight />
<T.AmbientLight />

<!-- CUBE -->
<T.Mesh>
  <RoundedBoxGeometry radius={0.1} />
  <T.MeshStandardMaterial color="red" />
</T.Mesh>

<T.Mesh>
  <T.CylinderGeometry args={[2, 2, 0.2, 128]} />
  <T.MeshStandardMaterial />
</T.Mesh>
