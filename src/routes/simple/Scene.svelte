<script lang="ts">
  import { T } from '@threlte/core'
  import { RoundedBoxGeometry } from '@threlte/extras'
</script>

<!-- CAMERA -->
<T.PerspectiveCamera
  position={[-8.9479,4.2,6.5803]}
  makeDefault
  fov={24.75}
  rotation={[-0.509,-0.8405,-0.394]}
/>

<!-- LIGHTS -->
<T.DirectionalLight position={[-2.5,8,3.1]} castShadow color="#fcbaba" />
<T.AmbientLight color="#e1e5ff" />

<!-- CUBE -->
<T.Mesh position={[0,0.9,0]} castShadow>
  <RoundedBoxGeometry radius={0.1} />
  <T.MeshStandardMaterial color="red" />
</T.Mesh>

<T.Mesh receiveShadow>
  <T.CylinderGeometry args={[2, 2, 0.2, 128]} />
  <T.MeshStandardMaterial />
</T.Mesh>
