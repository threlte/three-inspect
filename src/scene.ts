import * as lights from './lights'
import * as objects from './objects'

export const initScene = (scene: THREE.Scene) => {

  const add = scene.add.bind(scene)
  const remove = scene.remove.bind(scene)
  const clear = scene.clear.bind(scene)
  
  const register = (object: THREE.Object3D) => {
    if ((object as THREE.Light).isLight) {
      lights.register(object as THREE.Light)
    } else {
      objects.register(object)
    }
  }
  
  const deregister = (object: THREE.Object3D) => {
    if ((object as THREE.Light).isLight) {
      lights.deregister(object as THREE.Light)
    } else {
      objects.deregister(object)
    }
  }

  const deregisterAll = () => {
    const { children } = scene
    for (let i = 0, l = children.length; i < l; i += 1) {
      deregister(children[i])
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
    deregisterAll()
  
    return clear()
  }

  return () => {
    deregisterAll()
    scene.add = add
    scene.remove = remove
    scene.clear = clear
  }
}
