import './main.css'
import * as THREE from 'three'
import { loadTexture, three } from 'trzy'
import Inspector from '../src/main'
import vertexShader from './vert.glsl'
import fragmentShader from './frag.glsl'

const { scene, camera, renderer, canvas, update, start, beforeRender } = three({ autostart: false })

canvas.id = 'canvas'

const cam = camera.current as THREE.PerspectiveCamera

cam.far = 300
cam.position.set(0, 2, 10)

const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg'
])

let meshes: THREE.Object3D[] = []
let materials: THREE.Material[] = []

// Create starfield
{
  const geometry = new THREE.BufferGeometry();
  const vec3 = new THREE.Vector3();

  const count = 10_000
  const radius = 100

  const vertices = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    vec3.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(radius)
    vertices[i + 0] = vec3.x
    vertices[i + 1] = vec3.y
    vertices[i + 2] = vec3.z
  }
  
  // itemSize = 3 because there are 3 values (components) per vertex
  geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
  geometry.translate(0, 0.5, 0)

  const material = new THREE.PointsMaterial()
  material.size = 0.2
  material.sizeAttenuation = true
  const points = new THREE.Points(geometry, material)
  points.name = 'Stars'
  scene.add(points)
}

// Add an ambient light
{
  const ambient = new THREE.AmbientLight()
  ambient.intensity = 0.8
  scene.add(ambient)
}

// Add a directional light
{
  const directional = new THREE.DirectionalLight()
  directional.castShadow = true
  directional.shadow.mapSize.height = 512
  directional.shadow.mapSize.width = 512
  directional.shadow.camera.far = 30
  directional.intensity = 1.5
  scene.add(directional)
  directional.position.set(3, 5, 3)
}

// Add the floor
{
  const geometry = new THREE.BoxGeometry(20, 5, 0.1).rotateX(Math.PI / 2).translate(0, -1, 0)
  const material = new THREE.MeshPhysicalMaterial({ color: 'lightslategrey' })
  material.envMap = environmentMapTexture
  material.transparent = true
  material.opacity = 0.7
  material.envMapIntensity = 1
  material.reflectivity = 1
  material.clearcoat = 1
  material.clearcoatRoughness = 0.08
  material.transmission = 1
  materials.push(material)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Floor'
  mesh.castShadow = mesh.receiveShadow = true
  scene.add(mesh)
}

const size = 1

// Add a box
{
  const object = new THREE.Object3D()
  const geometry = new THREE.BoxGeometry(size, size, size)
  const material = new THREE.ShaderMaterial({
    uniforms: {
      color1: { value: { x: 1, y: 1, z: 0 } },
      color2: { value: { x: 0, y: 1, z: 1 } },
    },
    vertexShader,
    fragmentShader,
  })
  materials.push(material)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Box'
  object.add(mesh)
  scene.add(object)
  meshes.push(object)
}

// Add a cartoonish cone
{
  const geometry = new THREE.ConeGeometry(size / 2, size, 30, 30)
  const material = new THREE.MeshToonMaterial({ color: 'hotpink' })
  materials.push(material)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Cone'
  mesh.position.x = 2
  scene.add(mesh)
  meshes.push(mesh)
}

// Add a sphere
{
  const geometry = new THREE.SphereGeometry(size / 2, 30, 30)
  const material = new THREE.MeshStandardMaterial({ color: 'lightblue' })
  material.envMap = environmentMapTexture
  material.envMapIntensity = 1
  material.roughness = 0
  material.metalness = 1
  materials.push(material)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Sphere'
  mesh.position.x = -2
  scene.add(mesh)
  meshes.push(mesh)
}

// Add a torus knot
const addTorusKnot = async () => {
  const geometry = new THREE.TorusKnotGeometry(size / 2, size / 10, 70, 70)
  const material = new THREE.MeshStandardMaterial({ color: 'darksalmon' })
  material.envMap = environmentMapTexture
  material.envMapIntensity = 1
  materials.push(material)

  const repeatX = 10

  const textures = await Promise.all([
    loadTexture('/textures/metal/weave_COL_1K_METALNESS.jpg'),
    loadTexture('/textures/metal/weave_AO_1K_METALNESS.jpg'),
    loadTexture('/textures/metal/weave_DISP_1K_METALNESS.jpg'),
    loadTexture('/textures/metal/weave_NRM_1K_METALNESS.jpg'),
    loadTexture('/textures/metal/weave_ROUGHNESS_1K_METALNESS.jpg'),
    loadTexture('/textures/metal/weave_METALNESS_1K_METALNESS.jpg'),
  ])

  for (const texture of textures) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.x = repeatX
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
  }

  material.map = textures[0]
  material.aoMap = textures[1]
  material.displacementMap = textures[2]
  material.displacementScale = 0.005
  material.normalMap = textures[3]
  material.roughnessMap = textures[4]
  material.metalnessMap = textures[5]

  material.roughness = 0.17
  material.metalness = 0.95

  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Torus Knot'
  mesh.position.x = -4
  mesh.castShadow = true
  mesh.receiveShadow = true
  scene.add(mesh)
  meshes.push(mesh)

  start()
}

addTorusKnot()

// Add a torus / donut
{
  const geometry = new THREE.TorusGeometry(size / 2, size / 10, 10, 20)
  const material = new THREE.MeshPhysicalMaterial()
  material.envMap = environmentMapTexture
  material.envMapIntensity = 1
  material.roughness = 0.17
  material.metalness = 1
  materials.push(material)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Torus / Donut'
  mesh.position.x = 4
  scene.add(mesh)
  meshes.push(mesh)
}

// Add a Cylinder
{
  const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 20)
  const edges = new THREE.EdgesGeometry(geometry, 1);
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
  line.name = 'Cylinder'
  line.position.x = 6

  scene.add(line)
  meshes.push(line)
}

{
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 0.01),
    new THREE.MeshPhysicalMaterial()
  )

  mesh.name = 'Plane'
  mesh.position.x = -6
  scene.add(mesh)
  meshes.push(mesh)
}

for (const mesh of meshes) {
  mesh.castShadow = true
  mesh.receiveShadow = true
}

update(() => {
  for (const mesh of meshes) {
    mesh.rotation.y += 0.01
  }
})

new Inspector({ scene, camera: cam, renderer })
