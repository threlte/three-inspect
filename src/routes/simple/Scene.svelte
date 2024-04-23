<script lang="ts">
  import { T, useTask } from '@threlte/core'
  import { RoundedBoxGeometry, Float } from '@threlte/extras'

  let rotationY = $state(0)

  useTask((delta) => {
    rotationY += 0.2 * delta
  })
</script>

<!-- CAMERA -->
<T.PerspectiveCamera
  position={[-8.9479, 4.2, 6.5803]}
  makeDefault
  fov={24.75}
  rotation={[-0.509, -0.8405, -0.394]}
/>

<!-- LIGHTS -->
<T.DirectionalLight
  position={[-2.5, 8, 3.1]}
  castShadow
  color="#fcbaba"
  shadow.mapSize.width={2048}
  shadow.mapSize.height={2048}
  shadow.autoUpdate
/>
<T.AmbientLight color="#e1e5ff" />

<!-- CUBE -->
<Float>
  <T.Mesh
    position={[0, 0.9, 0]}
    castShadow
    rotation.y={rotationY}
  >
    <RoundedBoxGeometry radius={0.1} />
    <T.MeshStandardMaterial color="red" />
  </T.Mesh>
</Float>

<T.Mesh receiveShadow>
  <T.CylinderGeometry args={[2, 2, 0.2, 128]} />
  <T.MeshStandardMaterial />
</T.Mesh>
