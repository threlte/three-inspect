import './main.css'
import * as THREE from 'three'
import { three, Trail } from 'trzy'
import { createNoise3D, NoiseFunction3D } from 'simplex-noise'
import Inspector from '../src/main'
import vertexShader from './vert.glsl'
import fragmentShader from './frag.glsl'

const { scene, camera, renderer, canvas, update } = three();

canvas.id = 'canvas'

document.body.append(canvas)

scene.add(camera.current)

camera.current.near = -200
camera.current.far = 200

camera.current.position.set(5, 5, 5)
camera.current.lookAt(0, 0, 0)

const ambient = new THREE.AmbientLight()
scene.add(ambient)

{
  const directional = new THREE.DirectionalLight()
  directional.castShadow = true
  directional.shadow.normalBias = -0.1
  directional.shadow.camera.near = 0.4
  directional.shadow.camera.far = 47
  directional.shadow.camera.left = -22
  directional.shadow.camera.right = 22
  directional.shadow.camera.top = 21
  directional.shadow.camera.bottom = -21
  directional.position.set(5, 20, 2.5)
  scene.add(directional)
}

{
  const rect = new THREE.RectAreaLight(0xff0000)
  rect.intensity = 0.5
  rect.position.y = 0.1
  rect.rotateX(Math.PI / 2)
  rect.width = 30
  rect.height = 30
  scene.add(rect)
}

{
  // Geometry
  const geo = new THREE.BufferGeometry()
  const count = 10000
  const vec3 = new THREE.Vector3()

  const positions = new Float32Array(count * 3) // Multiply by 3 because each position is composed of 3 values (x, y, z)

  // for (let i = 0; i < count * 3; i += 3) {
  //   let th = Math.random() * 2 * Math.PI
  //   let n = 1000
  //   let r = 200
  //   let x = r * Math.sin(th) * Math.cos(n * th)
  //   let y = r * Math.sin(th) * Math.sin(n * th)
  //   let z = r * Math.cos(th)
    
  //   positions[i + 0] = x
  //   positions[i + 1] = y
  //   positions[i + 2] = z
  // }

  let radius = 100

  for (let i = 0; i < count * 3; i += 3) {
    vec3.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(radius)
    positions[i + 0] = vec3.x
    positions[i + 1] = vec3.y
    positions[i + 2] = vec3.z
  }

  // for(let i = 0; i < count * 3; i++) {
  //   positions[i] = (Math.random() - 0.5) * 10 // Math.random() - 0.5 to have a random value between -0.5 and +0.5
  // }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3)) // Create the Three.js BufferAttribute and specify that each information is composed of 3 values

  const mat = new THREE.PointsMaterial({
    size: 5,
    sizeAttenuation: true
  })
  const points = new THREE.Points(geo, mat)
  points.position.set(0, 0, 0)
  points.name = 'points'
  scene.add(points)
}

{
  const count = 20
  const trails: { trail: Trail, noise3d: NoiseFunction3D }[] = []
  const v3 = new THREE.Vector3()

  for (let i = 0; i < count; i += 1) {
    let j = 0
    const noise3d = createNoise3D(() => Math.random() * 2)
    const trail = new Trail()
    trail.decay = 3
    trail.geometry.attenuation = 'squared'
    trail.position.set(0, 7, 0)
    scene.add(trail)
    trails.push({ trail, noise3d })
  }

  let time = 0

  update((_, delta) => {
    time += delta

    for (let i = 0, l = trails.length; i < l; i += 1) {
      const { trail, noise3d } = trails[i]
      const x = noise3d(Math.sin(time / 10000) * 10, 0, 0)
      const y = noise3d(0, Math.cos(time / 10000) * 10, 0)
      const z = noise3d(0, 0, Math.sin(time / 10000) * 10)
      v3.set(x * 5, y * 10, z * 10)
      trail.target.position.lerp(v3, 0.05)
      trail.update()
    }
  })
}

const euler = new THREE.Euler()
const m4 = new THREE.Matrix4()
const position = (symmetry = true) => (Math.random() - (symmetry ? 0.5 : 0)) * 20
const rotation = () => Math.random() * Math.PI * 2

const geometry = new THREE.BoxGeometry(3, 3, 3)
const material = new THREE.MeshPhysicalMaterial()
const box = new THREE.Mesh(geometry, material)
box.name = 'Box'
box.castShadow = true
box.receiveShadow = true
box.position.set(0, 1.5, 0)
scene.add(box)

update(() => {
  box.rotation.y += 0.01
})

const count = 30
{
  const geometry = new THREE.DodecahedronGeometry()
  const material = new THREE.MeshPhysicalMaterial()
  const mesh = new THREE.InstancedMesh(geometry, material, count)
  mesh.name = 'Dodecahedrons'
  mesh.castShadow = mesh.receiveShadow = true
  box.add(mesh)

  for (let i = 0; i < count; i += 1) {
    euler.set(rotation(), rotation(), rotation())
    m4.makeRotationFromEuler(euler)
    m4.setPosition(position(), position(false), position())
    mesh.setMatrixAt(i, m4)
  }
  mesh.instanceMatrix.needsUpdate = true  
}

{
  const geometry = new THREE.PlaneGeometry(30, 30).rotateX(-Math.PI / 2)
  const material = new THREE.MeshStandardMaterial()
  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Floor'
  mesh.castShadow = mesh.receiveShadow = true
  scene.add(mesh)
}

{
  const colors = new Float32Array([
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
    0, 1, 1,
  ])
  
  const size = 2
  const geometry = new THREE.BoxGeometry(size, size, size)
  const material = new THREE.ShaderMaterial({
    uniforms: {
      color1: { value: { x: 1, y: 1, z: 0 } },
      color2: { value: { x: 0, y: 1, z: 1 } },
    },
    vertexShader,
    fragmentShader,
  })
  
  geometry.setAttribute('colors', new THREE.Float32BufferAttribute(colors, 3))
  
  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Shader Mesh'
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.position.set(10, 1, 0)
  scene.add(mesh)
}

let inspector: Inspector | undefined

const toggle = () => {
  if (inspector) {
    inspector.dispose()
    inspector = undefined
  } else {
    inspector = new Inspector({ THREE, scene, camera: camera.current, renderer })
  }
}

toggle()

const pane = inspector?.addPane('Game')
pane?.addInput({ test: '' }, 'test')
