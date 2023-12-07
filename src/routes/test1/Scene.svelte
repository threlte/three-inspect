<script lang='ts'>
  import * as THREE from 'three'
  import { T, useTask, useThrelte } from '@threlte/core'
  import { OrbitControls, InstancedMesh, Instance } from '@threlte/extras'
  import { createNoise3D, type NoiseFunction3D } from 'simplex-noise'
  import { ThrelteInspector } from '$lib'

  const { scene, renderer, camera } = useThrelte()

  scene.background = new THREE.Color('black')

  // {
  //   const count = 20
  //   const trails: { trail: Trail, noise3d: NoiseFunction3D }[] = []
  //   const v3 = new THREE.Vector3()

  //   for (let i = 0; i < count; i += 1) {
  //     let j = 0
  //     const noise3d = createNoise3D(() => Math.random() * 2)
  //     const trail = new Trail()
  //     trail.decay = 3
  //     trail.geometry.attenuation = 'squared'
  //     trail.position.set(0, 7, 0)
  //     scene.add(trail)
  //     trails.push({ trail, noise3d })
  //   }

  //   let time = 0

  //   useTask((delta) => {
  //     time += delta

  //     for (let i = 0, l = trails.length; i < l; i += 1) {
  //       const { trail, noise3d } = trails[i]
  //       const x = noise3d(Math.sin(time / 10000) * 10, 0, 0)
  //       const y = noise3d(0, Math.cos(time / 10000) * 10, 0)
  //       const z = noise3d(0, 0, Math.sin(time / 10000) * 10)
  //       v3.set(x * 5, y * 10, z * 10)
  //       trail.target.position.lerp(v3, 0.05)
  //       trail.update()
  //     }
  //   })
  // }

  const euler = new THREE.Euler()
  const m4 = new THREE.Matrix4()
  const position = (symmetry = true) => (Math.random() - (symmetry ? 0.5 : 0)) * 20
  const rotation = () => Math.random() * Math.PI * 2
</script>

<ThrelteInspector />

<T.OrthographicCamera
	makeDefault
	position={[10, 8, 12]}
	zoom={50}
  near={-500}
  far={500}
	on:create={({ ref }) => ref.lookAt(0, 0, 0)}
>
	<OrbitControls autoRotate enableDamping />
</T.OrthographicCamera>

<T.AmbientLight />

<T.DirectionalLight
  castShadow
  position={[5, 20, 2.5]}
  shadow.normalBias={-0.1}
  shadow.camera.near={0.4}
  shadow.camera.far={50}
  shadow.camera.left={-22}
  shadow.camera.right={22}
  shadow.camera.top={22}
  shadow.camera.bottom={-22}
/>

<T.RectAreaLight
  color='0xff0000'
  intensity={0.5}
  position.y={1}
  width={30}
  height={30}
/>

<T.Mesh
  name='Floor'
  castShadow
  receiveShadow
  rotation.x={-Math.PI / 2}
>
  <T.PlaneGeometry args={[30, 30]} />
  <T.MeshStandardMaterial />
</T.Mesh>

<InstancedMesh
  name='Dodecahedrons'
  castShadow
  receiveShadow
>
  <T.MeshPhysicalMaterial />
  <T.DodecahedronGeometry />

  {#each { length: 30 } as _, index (index)}
    <T.Group
      position={[position(), position(false), position()]}
      rotation={[rotation(), rotation(), rotation()]}
    >
      <Instance />
    </T.Group>
  {/each}
</InstancedMesh>

<T.Mesh
  name='Shader Mesh'
  castShadow
  receiveShadow
  position={[10, 1, 0]}
>
  <T.BoxGeometry args={[2, 2, 2]} />
  <T.ShaderMaterial
    uniforms={{
      color1: { value: { x: 1, y: 1, z: 0 } },
      color2: { value: { x: 0, y: 1, z: 1 } },
    }}
    vertexShader={`
      varying vec2 vUv;

      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vUv = uv;
      }
    `}
    fragmentShader={`
      varying vec2 vUv;

      uniform vec3 color1;
      uniform vec3 color2;

      void main () {
        gl_FragColor = vec4(mix(color1, color2, vUv.x), 1.0);
      }
    `}
  />
</T.Mesh>
