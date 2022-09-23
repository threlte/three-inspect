import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import { addTransformInputs } from '../inputs/transform'
import { addFolder, pane } from '../pane'
import { defaultMinMax, shadowmapSizes } from '../constants'
import { disposeHelper } from '../lib/dispose'
import { three } from '../three'

type LightHelper =
  | THREE.SpotLightHelper
  | THREE.DirectionalLightHelper
  | THREE.HemisphereLightHelper
  | RectAreaLightHelper
  | THREE.PointLightHelper
  | THREE.CameraHelper

const lightFolder = addFolder(pane, 'lights', 1)

export const addLightFolder = (light: THREE.Light) => {
  const THREE = three()
  const folder = addFolder(lightFolder, `#${light.id} ${light.name} (${light.type})`)

  let helper: LightHelper | undefined
  let shadowHelper: THREE.CameraHelper | undefined

  const params = {
    helper: false,
    shadowHelper: false,
    color: `#${light.color.getHexString().toUpperCase()}`,
  }

  if (('isAmbientLight' in light) === false) {
    folder
      .addInput(params, 'helper')
      .on('change', () => light[params.helper ? 'add' : 'remove'](helper!))
  }

  if (light.castShadow) {
    folder
      .addInput(params, 'shadowHelper', { label: 'shadow helper' })
      .on('change', () => light[params.shadowHelper ? 'add' : 'remove'](shadowHelper!))
  }

  folder
    .addInput(params, 'color')
    .on('change', () => light.color.set(params.color))

  folder.addInput(light, 'intensity')

  if (light instanceof THREE.HemisphereLight) {
    folder.addInput(light, 'groundColor')
    helper = new THREE.HemisphereLightHelper(light, 10)
  } else if (light instanceof THREE.DirectionalLight) {
    helper = new THREE.DirectionalLightHelper(light)
  } else if (light instanceof THREE.PointLight) {
    helper = new THREE.PointLightHelper(light, 10)
  }

  if (
    light instanceof THREE.DirectionalLight ||
    light instanceof THREE.SpotLight ||
    light instanceof THREE.PointLight
  ) {
    folder.addInput(light, 'castShadow')
    addTransformInputs(folder, light)
  }

  if (
    light instanceof THREE.DirectionalLight ||
    light instanceof THREE.SpotLight
  ) {
    const targetFolder = addFolder(folder, 'target')
    targetFolder.addInput(light.target, 'position', { step: 0.1 }).on('change', () => {
      light.target.updateMatrixWorld()
    })
  }

  if (light instanceof THREE.SpotLight) {
    folder.addInput(light, 'angle', {
      max: Math.PI / 2,
      min: 0,
    })
    folder.addInput(light, 'penumbra', defaultMinMax)

    helper = new THREE.SpotLightHelper(light)
  }

  if (
    light instanceof THREE.SpotLight ||
    light instanceof THREE.PointLight ||
    light instanceof THREE.RectAreaLight
  ) {
    folder.addInput(light, 'power')
  }

  if (
    light instanceof THREE.SpotLight ||
    light instanceof THREE.PointLight
  ) {
    folder.addInput(light, 'decay')
    folder.addInput(light, 'distance')
  } else if (light instanceof THREE.RectAreaLight) {
    folder.addInput(light, 'width')
    folder.addInput(light, 'height')

    helper = new RectAreaLightHelper(light)
  }

  if (light.castShadow) {
    const camFolder = addFolder(folder, `#${light.id} shadow camera`)

    const shadowMapParams = {
      mapSize: light.shadow.mapSize.x,
    }

    const handleShadowmapChange = () => {
      light.shadow.mapSize.width = shadowMapParams.mapSize
      light.shadow.mapSize.height = shadowMapParams.mapSize
      light.shadow.dispose()
      // @ts-expect-error This is needed to recalculate the shadow map.
      light.shadow.map = null
    }

    camFolder
      .addInput(shadowMapParams, 'mapSize', { options: shadowmapSizes })
      .on('change', handleShadowmapChange)

    camFolder.addInput(light.shadow, 'bias', {
      max: 0.09,
      min: 0,
      step: 0.001,
    })

    camFolder.addInput(light.shadow, 'normalBias').on('change', handleShadowmapChange)
    camFolder.addInput(light.shadow, 'radius').on('change', handleShadowmapChange)

    if (
      light instanceof THREE.SpotLight ||
      light instanceof THREE.DirectionalLight
    ) {
      const camera = light.shadow.camera
      camFolder.addInput(camera, 'near').on('change', handleShadowmapChange)
      camFolder.addInput(camera, 'far').on('change', handleShadowmapChange)
      addTransformInputs(camFolder, camera)
    }
    
    if (
      light instanceof THREE.DirectionalLight
    ) {
      const camera = light.shadow.camera
      camFolder.addInput(camera, 'left').on('change', handleShadowmapChange)
      camFolder.addInput(camera, 'right').on('change', handleShadowmapChange)
      camFolder.addInput(camera, 'top').on('change', handleShadowmapChange)
      camFolder.addInput(camera, 'bottom').on('change', handleShadowmapChange)
    } else if (light instanceof THREE.SpotLight) {
      const camera = light.shadow.camera
      camFolder.addInput(camera, 'focus', defaultMinMax)
    }

    shadowHelper = new THREE.CameraHelper(light.shadow.camera)
  }

  folder.on('change', () => {
    // @ts-expect-error update() is not correctly typed
    helper?.update?.()
    shadowHelper?.update?.()
  })

  return () => {
    if (helper !== undefined) {
      light.remove(helper)
      disposeHelper(helper as THREE.Line)
    }

    if (shadowHelper !== undefined) {
      light.remove(shadowHelper)
      disposeHelper(shadowHelper)
    }
  }
}
