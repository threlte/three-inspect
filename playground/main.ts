import './main.css'
import * as THREE from 'three'
import { scene, camera, renderer, run, lights, composer } from 'three-kit'

camera.parent!.name = 'Camera'

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


const euler = new THREE.Euler()
const m4 = new THREE.Matrix4()
const position = (symmetry = true) => (Math.random() - (symmetry ? 0.5 : 0)) * 20
const rotation = () => Math.random() * Math.PI * 2

const geometry = new THREE.BoxGeometry(3, 3, 3)
const material = new THREE.MeshStandardMaterial()
const box = new THREE.Mesh(geometry, material)
box.name = 'Box'
box.castShadow = box.receiveShadow = true
box.position.set(0, 1.5, 0)
scene.add(box)

const count = 30
{
  const geometry = new THREE.DodecahedronGeometry()
  const material = new THREE.MeshStandardMaterial()
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

const debug = await import('../src/main')
debug.init(THREE, scene, camera, renderer, composer)
run()
