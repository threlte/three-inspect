import { defaultMinMax, shadowmapSizes } from '../constants'
import type { Pane } from '../pane'
import { addTransformInputs } from './transform'
import { addUserdataInput } from './userdata'
import { createRectAreaLightHelper } from '../lib/rectarealight'
import { three } from '../three'

type LightHelper =
  | THREE.SpotLightHelper
  | THREE.DirectionalLightHelper
  | THREE.HemisphereLightHelper
  | THREE.PointLightHelper
  | THREE.CameraHelper
  | THREE.Line

type TargetLight =
  | THREE.DirectionalLight
  | THREE.SpotLight

const addTargetInput = (folder: Pane, light: TargetLight) => {
  folder.addSeparator()
  folder.addInput(light.target, 'position', {
    label: 'target position',
    step: 0.1,
  }).on('change', () => {
    light.target.updateMatrixWorld()
  })
}

export const addLightInputs = (pane: Pane, light: THREE.Light) => {
  const THREE = three()

  let helper: LightHelper | undefined
  let shadowHelper: THREE.CameraHelper | undefined

  const disposers: Disposer[] = []

  const params = {
    color: `#${light.color.getHexString().toUpperCase()}`,
    helper: false,
    shadowHelper: false,
  }

  if (!(light instanceof THREE.AmbientLight)) {
    pane
      .addInput(params, 'helper')
      .on('change', () => helper && light[params.helper ? 'add' : 'remove'](helper))
  }

  pane
    .addInput(params, 'color')
    .on('change', () => light.color.set(params.color))

  pane.addInput(light, 'intensity')

  /**
   * Directional
   */
  if (light instanceof THREE.DirectionalLight) {
    pane.addInput(light, 'castShadow')

    addTransformInputs(pane, light)
    addTargetInput(pane, light)

    helper = new THREE.DirectionalLightHelper(light)

  /**
   * Hemisphere
   */
  } else if (light instanceof THREE.HemisphereLight) {
    pane.addInput(light, 'groundColor')

    helper = new THREE.HemisphereLightHelper(light, 10)

  /**
   * Point
   */
  } else if (light instanceof THREE.PointLight) {
    pane.addInput(light, 'decay')
    pane.addInput(light, 'distance')
    pane.addInput(light, 'power')
    pane.addInput(light, 'castShadow')

    addTransformInputs(pane, light)

    helper = new THREE.PointLightHelper(light, 10)

  /**
   * Spot
   */
  } else if (light instanceof THREE.SpotLight) {
    pane.addInput(light, 'angle', {
      max: Math.PI / 2,
      min: 0,
    })
    pane.addInput(light, 'decay')
    pane.addInput(light, 'distance')
    pane.addInput(light, 'penumbra', defaultMinMax)
    pane.addInput(light, 'power')
    pane.addInput(light, 'castShadow')

    addTransformInputs(pane, light)
    addTargetInput(pane, light)

    helper = new THREE.SpotLightHelper(light)

  /**
   * Rect
   */
  } else if (light instanceof THREE.RectAreaLight) {
    pane.addInput(light, 'power')
    pane.addInput(light, 'width')
    pane.addInput(light, 'height')

    addTransformInputs(pane, light)

    helper = createRectAreaLightHelper(light)
  }

  if (helper !== undefined) {
    helper.userData.THREE_INSPECT_OMIT = true
  }

  if (light.castShadow) {
    const camFolder = pane.addFolder({ index: light.id, title: 'Shadow Camera' })

    camFolder.addInput(light.shadow, 'autoUpdate')

    camFolder
      .addInput(params, 'shadowHelper', { label: 'helper' })
      .on('change', () => shadowHelper && light[params.shadowHelper ? 'add' : 'remove'](shadowHelper))

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

    /**
     * Directional
     */
    if (light instanceof THREE.DirectionalLight) {
      const { camera } = light.shadow
      camFolder.addInput(camera, 'near').on('change', handleShadowmapChange)
      camFolder.addInput(camera, 'far').on('change', handleShadowmapChange)
      camFolder.addInput(camera, 'left').on('change', handleShadowmapChange)
      camFolder.addInput(camera, 'right').on('change', handleShadowmapChange)
      camFolder.addInput(camera, 'top').on('change', handleShadowmapChange)
      camFolder.addInput(camera, 'bottom').on('change', handleShadowmapChange)

      addTransformInputs(camFolder, camera)

    /**
     * Spot
     */
    } else if (light instanceof THREE.SpotLight) {
      const { camera } = light.shadow
      camFolder.addInput(camera, 'near').on('change', handleShadowmapChange)
      camFolder.addInput(camera, 'far').on('change', handleShadowmapChange)
      camFolder.addInput(camera, 'focus', defaultMinMax)

      addTransformInputs(camFolder, camera)
    }

    shadowHelper = new THREE.CameraHelper(light.shadow.camera)
    shadowHelper.userData.THREE_INSPECT_OMIT = true
  }

  pane.on('change', () => {
    // @ts-expect-error update() is not correctly typed
    helper?.update?.()
    shadowHelper?.update?.()
  })

  disposers.push(addUserdataInput(pane, light))
  disposers.push(() => {
    if (helper !== undefined) {
      light.remove(helper)
      // @ts-expect-error exists
      helper.dispose?.()
    }

    if (shadowHelper !== undefined) {
      light.remove(shadowHelper)
      shadowHelper.dispose()
    }
  })

  return disposers
}
