/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import { type Pane, pane } from '../pane'
import { defaultMinMax, shadowmapSizes } from '../constants'
import { addTransformInputs } from '../inputs/transform'
import { createRectAreaLightHelper } from '../lib/rectarealight'
import { disposeHelper } from '../lib/dispose'
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

let lightFolder: Pane

export const initLightFolder = () => {
  lightFolder = pane.addFolder({ title: 'Lights' })

  return () => lightFolder.dispose()
}

const addTargetInput = (folder: Pane, light: TargetLight) => {
  const targetFolder = folder.addFolder({ index: light.id, title: 'Target' })
  targetFolder.addInput(light.target, 'position', { step: 0.1 }).on('change', () => {
    light.target.updateMatrixWorld()
  })
}

export const addLightFolder = (light: THREE.Light) => {
  const folder = lightFolder.addFolder({
    index: light.id,
    title: `${light.name} (${light.type})`,
  })
  const THREE = three()
  const dirLight = light as THREE.DirectionalLight
  const hemiLight = light as THREE.HemisphereLight
  const pointLight = light as THREE.PointLight
  const spotLight = light as THREE.SpotLight
  const rectLight = light as THREE.RectAreaLight

  let helper: LightHelper | undefined
  let shadowHelper: THREE.CameraHelper | undefined

  const params = {
    color: `#${light.color.getHexString().toUpperCase()}`,
    helper: false,
    shadowHelper: false,
  }

  if (!('isAmbientLight' in light)) {
    folder
      .addInput(params, 'helper')
      .on('change', () => light[params.helper ? 'add' : 'remove'](helper!))
  }

  folder
    .addInput(params, 'color')
    .on('change', () => light.color.set(params.color))

  folder.addInput(light, 'intensity')

  /**
   * Directional
   */
  if (dirLight.isDirectionalLight) {
    folder.addInput(light, 'castShadow')

    addTransformInputs(folder, light)
    addTargetInput(folder, dirLight)

    helper = new THREE.DirectionalLightHelper(dirLight)

  /**
   * Hemisphere
   */
  } else if (hemiLight.isHemisphereLight) {
    folder.addInput(hemiLight, 'groundColor')

    helper = new THREE.HemisphereLightHelper(hemiLight, 10)

  /**
   * Point
   * There's no .isPointLight ???
   */
  } else if (light instanceof THREE.PointLight) {
    folder.addInput(pointLight, 'decay')
    folder.addInput(pointLight, 'distance')
    folder.addInput(pointLight, 'power')
    folder.addInput(pointLight, 'castShadow')

    addTransformInputs(folder, pointLight)

    helper = new THREE.PointLightHelper(pointLight, 10)

  /**
   * Spot
   */
  } else if (spotLight.isSpotLight) {
    folder.addInput(spotLight, 'angle', {
      max: Math.PI / 2,
      min: 0,
    })
    folder.addInput(spotLight, 'decay')
    folder.addInput(spotLight, 'distance')
    folder.addInput(spotLight, 'penumbra', defaultMinMax)
    folder.addInput(spotLight, 'power')
    folder.addInput(spotLight, 'castShadow')

    addTransformInputs(folder, spotLight)
    addTargetInput(folder, spotLight)

    helper = new THREE.SpotLightHelper(spotLight)

  /**
   * Rect
   */
  } else if (rectLight.isRectAreaLight) {
    folder.addInput(rectLight, 'power')
    folder.addInput(rectLight, 'width')
    folder.addInput(rectLight, 'height')

    addTransformInputs(folder, rectLight)

    helper = createRectAreaLightHelper(rectLight)
  }

  if (light.castShadow) {
    const camFolder = folder.addFolder({ index: light.id, title: 'Shadow Camera' })

    camFolder
      .addInput(params, 'shadowHelper', { label: 'helper' })
      .on('change', () => light[params.shadowHelper ? 'add' : 'remove'](shadowHelper!))

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
    if (dirLight.isDirectionalLight) {
      const { camera } = dirLight.shadow
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
    } else if (spotLight.isSpotLight) {
      const { camera } = spotLight.shadow
      camFolder.addInput(camera, 'near').on('change', handleShadowmapChange)
      camFolder.addInput(camera, 'far').on('change', handleShadowmapChange)
      camFolder.addInput(camera, 'focus', defaultMinMax)

      addTransformInputs(camFolder, camera)
    }

    shadowHelper = new THREE.CameraHelper(light.shadow.camera)
  }

  folder.on('change', () => {
    // @ts-expect-error update() is not correctly typed
    helper?.update?.()
    shadowHelper?.update?.()
  })

  return () => {
    folder.dispose()

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
