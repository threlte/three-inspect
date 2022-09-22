import * as THREE from 'three'
import * as lights from './lights'
import * as objects from './objects'

export const initScene = (scene: THREE.Scene) => {

  const add = scene.add.bind(scene)
  const remove = scene.remove.bind(scene)
  const clear = scene.clear.bind(scene)
  
  const register = (object: THREE.Object3D) => {
    if (object instanceof THREE.Light) {
      lights.register(object)
    } else if (object instanceof THREE.Object3D) {
      objects.register(object)
    } else {
      // eslint-disable-next-line no-console
      console.log('three-kit debug unregistered item:', object)
    }
  }
  
  const deregister = (object: THREE.Object3D) => {
    if (object instanceof THREE.Light) {
      lights.deregister(object)
    } else if (object instanceof THREE.Object3D) {
      objects.deregister(object)
    }
  }
  
  for (const child of scene.children) {
    register(child)
  }

  scene.add = (...args: THREE.Object3D[]) => {
    for (let i = 0, l = args.length; i < l; i += 1) {
      register(args[i])
    }
  
    return add(...args)
  }
  
  scene.remove = (...args: THREE.Object3D[]) => {
    for (let i = 0, l = args.length; i < l; i += 1) {
      deregister(args[i])
    }
  
    return remove(...args)
  }
  
  scene.clear = () => {
    const { children } = scene
    for (let i = 0, l = children.length; i < l; i += 1) {
      deregister(children[i])
    }
  
    return clear()
  }
}
