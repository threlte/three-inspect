<script lang='ts'>
  import * as THREE from 'three'
  import { T, useThrelte, useTask } from '@threlte/core'
  import { Inspector } from '$lib'
  import { Edges, useTexture } from '@threlte/extras'

  const { scene, camera, renderer } = useThrelte()

  scene.background = new THREE.Color('#222')
  scene.add(camera.current)

  camera.current.far = 300
  camera.current.position.set(0, 2, 10)

  const cubeTextureLoader = new THREE.CubeTextureLoader()

  const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg',
  ])

  const meshes: THREE.Object3D[] = []

  // Create starfield
{
  const geometry = new THREE.BufferGeometry()
  const vec3 = new THREE.Vector3()

  const count = 10_000
  const radius = 100

  const vertices = new Float32Array(count * 3)

  for (let i = 0; i < count * 3; i += 3) {
    vec3.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(radius)
    vertices[i + 0] = vec3.x
    vertices[i + 1] = vec3.y
    vertices[i + 2] = vec3.z
  }

  geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) )
  geometry.translate(0, 0.5, 0)

  const material = new THREE.PointsMaterial()
  material.size = 0.2
  material.sizeAttenuation = true
  const points = new THREE.Points(geometry, material)
  points.name = 'Stars'
  scene.add(points)
}

  useTask((delta) => {
    for (const mesh of meshes) {
      mesh.rotation.y += delta
    }
  })
  
  const transform = (texture: THREE.Texture) => {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.x = 10
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
    return texture
  }

  const col = useTexture('/textures/metal/weave_COL_1K_METALNESS.jpg', { transform })
  const ao = useTexture('/textures/metal/weave_AO_1K_METALNESS.jpg', { transform })
  const disp = useTexture('/textures/metal/weave_DISP_1K_METALNESS.jpg', { transform })
  const nrm = useTexture('/textures/metal/weave_NRM_1K_METALNESS.jpg', { transform })
  const rough = useTexture('/textures/metal/weave_ROUGHNESS_1K_METALNESS.jpg', { transform })
  const metal = useTexture('/textures/metal/weave_METALNESS_1K_METALNESS.jpg', { transform })
</script>

<Inspector position='draggable' />

<T.AmbientLight intensity={0.8} />

<T.DirectionalLight
  castShadow
  intensity={1.5}
  position={[3, 5, 3]}
  shadow.mapSize.height={512}
  shadow.mapSize.width={512}
  shadow.camera.far={30}
/>

<T.Mesh
  name='Floor'
  rotation.x={Math.PI / 2}
  position.y={-1}
  castShadow
  receiveShadow
>
  <T.BoxGeometry args={[20, 5, 0.1]} />
  <T.MeshPhysicalMaterial
    color='lightslategrey'
    transparent
    opacity={0.7}
    envMap={environmentMapTexture}
    envMapIntensity={1}
    reflectivity={1}
    clearcoat={1}
    clearcoatRoughness={0.08}
    transmission={1}
  />
</T.Mesh>

<T.Object3D bind:ref={meshes[0]}>
  <T.Mesh
    name='Box'
    castShadow
    receiveShadow
  >
    <T.BoxGeometry />
    <T.ShaderMaterial
      uniforms={{
        color1: { value: { x: 1, y: 1, z: 0 } },
        color2: { value: { x: 0, y: 1, z: 1 } },
      }}
    />
  </T.Mesh>
</T.Object3D>

<T.Mesh
  bind:ref={meshes[1]}
  name='Cone'
  position.x={2}
  castShadow
  receiveShadow
>
  <T.ConeGeometry args={[0.5, 1, 30, 30]} />
  <T.MeshToonMaterial color='hotpink' />
</T.Mesh>

<T.Mesh
  bind:ref={meshes[2]}
  name='Sphere'
  position.x={-2}
  castShadow
  receiveShadow
>
  <T.SphereGeometry args={[0.5, 30, 30]} />
  <T.MeshStandardMaterial
    color='lightblue'
    envMap={environmentMapTexture}
    envMapIntensity={1}
    roughness={0}
    metalness={1}
  />
</T.Mesh>

<T.Mesh
  bind:ref={meshes[3]}
  name='Torus Knot'
  position.x={-4}
  castShadow
  receiveShadow
>
  <T.TorusKnotGeometry args={[0.5, 0.2, 70, 70]} />
  <T.MeshStandardMaterial
    color='darksalmon'
    envMap={environmentMapTexture}
    envMapIntensity={1}
    map={$col}
    aoMap={$ao}
    displacementMap={$disp}
    displacementScale={0.005}
    normalMap={$nrm}
    roughnessMap={$rough}
    metalnessMap={$metal}
    roughness={0.17}
    metalness={0.95}
  />
</T.Mesh>

<T.Mesh
  bind:ref={meshes[4]}
  name='Donut'
  position.x={4}
  castShadow
  receiveShadow
>
  <T.TorusGeometry args={[0.5, 0.2, 10, 20]} />
  <T.MeshPhysicalMaterial
    envMap={environmentMapTexture}
    envMapIntensity={1}
    roughness={0.15}
    metalness={1}
  />
</T.Mesh>

<T.Mesh
  bind:ref={meshes[5]}
  name='Cylinder'
  position.x={6}
  castShadow
  receiveShadow
>
  <T.CylinderGeometry args={[0.5, 0.5, 1, 20]} />
  <T.MeshToonMaterial color='cyan' />
  <Edges />
</T.Mesh>

<T.Mesh
  bind:ref={meshes[6]}
  name='Plane'
  position.x={-6}
  castShadow
  receiveShadow
>
  <T.BoxGeometry args={[1, 1, 0.01]} />
  <T.MeshPhysicalMaterial />
</T.Mesh>
