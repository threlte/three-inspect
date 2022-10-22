import './main.css'
import * as THREE from 'three'
import { scene, camera, renderer, run, lights, composer, update, Trail, createNoise3D } from 'three-kit'
import Debug from '../src/main'
import { OrbitControls } from '../src/lib/orbit-controls'

camera.parent!.name = 'Camera'
camera.near = -200
camera.far = 200

const ambient = lights.createAmbient()
scene.add(ambient)

{
  const directional = lights.createDirectional()
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
  const rect = lights.createRectArea('red')
  rect.intensity = 0.5
  rect.position.y = 0.1
  rect.rotateX(Math.PI / 2)
  rect.width = 30
  rect.height = 30
  scene.add(rect)
}

{
  const count = 3
  for (let i = 0; i < count; i += 1) {
    const noise3d = createNoise3D()
    const v3 = new THREE.Vector3()

    const trail = new Trail()
    trail.decay = 3
    trail.geometry.attenuation = 'squared'
    trail.position.set(0, 7, 0)
    scene.add(trail)

    update((time) => {
      // const x = Math.sin(time / 10000) / 2
      // const y = Math.cos(time / 10000) / 2
      // const z = Math.sin(time / 10000) / 2
    
      const x = noise3d(Math.sin(time / 10000) * 10, 0, 0)
      const y = noise3d(0, Math.cos(time / 10000) * 10, 0)
      const z = noise3d(0, 0, Math.sin(time / 10000) * 10)
      v3.set(x * 5, y * 10, z * 10)
      trail.target.position.lerp(v3, 0.05)
      trail.update()
    })
  }
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

camera.position.set(1, 1, 1)
camera.lookAt(0, 0, 0)

run()

let debug: Debug | undefined

const toggle = () => {
  if (debug) {
    debug.dispose()
    debug = undefined
  } else {
    debug = new Debug(THREE, scene, camera, renderer, composer)
  }
}

toggle()
// setInterval(toggle, 1_000)

const pane = debug?.addPane('Game')
pane?.addInput({ test: '' }, 'test')

// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true
// controls.enableKeyEvents = true

// update(() => {
//   controls.update()
// })
