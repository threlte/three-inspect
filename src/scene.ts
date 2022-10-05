import * as lights from './lights'
import * as objects from './objects'

export const initScene = (scene: THREE.Scene) => {
  const add = scene.add.bind(scene)
  const remove = scene.remove.bind(scene)
  const clear = scene.clear.bind(scene)

  const register = (object: THREE.Object3D) => {
    const light = object as THREE.Light

    if (light.isLight) {
      lights.register(light)
    } else {
      objects.register(object)
    }
  }

  const deregister = (object: THREE.Object3D) => {
    const light = object as THREE.Light

    if (light.isLight) {
      lights.deregister(light)
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

  const { children } = scene
  for (let i = 0, l = children.length; i < l; i += 1) {
    register(children[i])
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
