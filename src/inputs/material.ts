import type { Pane } from '../pane'
import { addTextureInputs } from '../inputs/texture'
import { defaultMinMax } from '../constants'
import { three } from '../three'

export const addMaterialInputs = (pane: Pane, mesh: THREE.Mesh) => {
  const THREE = three()
  const material = mesh.material as THREE.Material
  const folder = pane.addFolder({
    index: mesh.id,
    title: `${material.name} (${material.type})`.trim(),
  })

  const sideOptions = {
    BackSide: THREE.BackSide,
    DoubleSide: THREE.DoubleSide,
    FrontSide: THREE.FrontSide,
  }

  const normalMapTypeOptions = {
    ObjectSpaceNormalMap: THREE.ObjectSpaceNormalMap,
    TangentSpaceNormalMap: THREE.TangentSpaceNormalMap,
  }

  const updateMaterial = () => {
    material.needsUpdate = true
  }

  const addColorInput = (prop: 'color' | 'emissive' | 'attenuationColor') => {
    const mat = material as THREE.MeshPhysicalMaterial
    const colorParam = { [prop]: `#${mat[prop].getHexString()}` }
    folder.addInput(colorParam, prop).on('change', () => mat[prop].set(colorParam.color))
  }

  folder.addInput(material, 'visible')
  folder.addInput(material, 'side', { options: sideOptions })
  folder.addInput(material, 'transparent').on('change', updateMaterial)
  folder.addInput(material, 'opacity', defaultMinMax)
  folder.addInput(material, 'vertexColors')
  folder.addSeparator()

  /**
   * PointsMaterial
   */
  if (material instanceof THREE.PointsMaterial) {
    addColorInput('color')
    folder.addInput(material, 'size')
    folder.addInput(material, 'sizeAttenuation')

  /**
   * LineBasicMaterial
   */
  } else if (material instanceof THREE.LineBasicMaterial || material instanceof THREE.LineDashedMaterial) {
    addColorInput('color')
    folder.addInput(material, 'fog')
    folder.addInput(material, 'linewidth')

  /**
   * MeshBasicMaterial
   */
  } else if (material instanceof THREE.MeshBasicMaterial) {
    addColorInput('color')

    folder.addInput(material, 'fog')
    folder.addInput(material, 'reflectivity', defaultMinMax)
    folder.addInput(material, 'refractionRatio', defaultMinMax)
    folder.addInput(material, 'wireframe')

  /**
   * MeshDepthMaterial
   */
  } else if (material instanceof THREE.MeshDepthMaterial) {
    folder.addInput(material, 'fog')

  /**
   * MeshLambertMaterial
   */
  } else if (material instanceof THREE.MeshLambertMaterial) {
    addColorInput('color')
    addColorInput('emissive')
    folder.addInput(material, 'emissiveIntensity', { min: 0 })
    folder.addInput(material, 'flatShading').on('change', updateMaterial)
    folder.addInput(material, 'fog')
    folder.addInput(material, 'reflectivity', defaultMinMax)
    folder.addInput(material, 'refractionRatio', defaultMinMax)
    folder.addInput(material, 'wireframe')

  /**
   * MeshPhongMaterial
   */
  } else if (material instanceof THREE.MeshPhongMaterial) {
    addColorInput('color')
    addColorInput('emissive')
    folder.addInput(material, 'emissiveIntensity', { min: 0 })
    folder.addInput(material, 'flatShading').on('change', updateMaterial)
    folder.addInput(material, 'fog')
    folder.addInput(material, 'reflectivity', defaultMinMax)
    folder.addInput(material, 'refractionRatio', defaultMinMax)
    folder.addInput(material, 'shininess', defaultMinMax)
    folder.addInput(material, 'wireframe')

  /**
   * MeshStandardMaterial / MeshPhysicalMaterial
   */
  } else if (material instanceof THREE.MeshStandardMaterial) {
    addColorInput('color')
    addColorInput('emissive')
    folder.addInput(material, 'emissiveIntensity', { min: 0 })
    folder.addInput(material, 'roughness', defaultMinMax)
    folder.addInput(material, 'metalness', defaultMinMax)
    folder.addInput(material, 'flatShading').on('change', updateMaterial)
    folder.addInput(material, 'fog')
    folder.addInput(material, 'wireframe')
    folder.addInput(material, 'envMapIntensity')

    if (material instanceof THREE.MeshPhysicalMaterial) {
      addColorInput('attenuationColor')
      folder.addInput(material, 'reflectivity', defaultMinMax)
      folder.addInput(material, 'clearcoat', defaultMinMax)
      folder.addInput(material, 'clearcoatRoughness', defaultMinMax)
      folder.addInput(material, 'transmission', defaultMinMax)
    }

  /**
   * ShaderMaterial
   */
  } else if (material instanceof THREE.ShaderMaterial) {
    const shaderMatParams = {
      uniforms: JSON.stringify(material.uniforms, null, 2),
    }

    folder.addInput(shaderMatParams, 'uniforms', { view: 'textarea' }).on('change', () => {
      try {
        material.uniforms = JSON.parse(shaderMatParams.uniforms)
        updateMaterial()
      } catch {
        /* Do nothing */
      }
    })
    folder.addInput(material, 'vertexShader', { view: 'textarea' }).on('change', updateMaterial)
    folder.addInput(material, 'fragmentShader', { view: 'textarea' }).on('change', updateMaterial)
  }

  /**
   * Textures
   */
  if (
    material instanceof THREE.MeshBasicMaterial ||
    material instanceof THREE.MeshLambertMaterial ||
    material instanceof THREE.MeshPhongMaterial ||
    material instanceof THREE.MeshStandardMaterial ||
    material instanceof THREE.MeshPhysicalMaterial
  ) {
    /**
     * @TODO add:
     * - envMap
     */
    folder.addSeparator()
    addTextureInputs(folder, material, 'map')
    addTextureInputs(folder, material, 'alphaMap')
    addTextureInputs(folder, material, 'aoMap')
    folder.addInput(material, 'aoMapIntensity', defaultMinMax)
    addTextureInputs(folder, material, 'lightMap')
    folder.addInput(material, 'lightMapIntensity', defaultMinMax)

    if (
      material instanceof THREE.MeshLambertMaterial ||
      material instanceof THREE.MeshPhongMaterial ||
      material instanceof THREE.MeshStandardMaterial ||
      material instanceof THREE.MeshPhysicalMaterial
    ) {
      addTextureInputs(folder, material, 'bumpMap')
      folder.addInput(material, 'bumpScale', defaultMinMax)
      addTextureInputs(folder, material, 'displacementMap')
      folder.addInput(material, 'displacementScale')
      folder.addInput(material, 'displacementBias')
      addTextureInputs(folder, material, 'emissiveMap')
      addTextureInputs(folder, material, 'normalMap')
      folder.addInput(material, 'normalMapType', { options: normalMapTypeOptions })
    }

    if (
      material instanceof THREE.MeshStandardMaterial ||
      material instanceof THREE.MeshPhysicalMaterial
    ) {
      addTextureInputs(folder, material, 'metalnessMap')
      addTextureInputs(folder, material, 'roughnessMap')
    }
  }

  /**
   * Rarely used inputs
   */
  folder.addSeparator()
  folder.addInput(material, 'alphaTest', defaultMinMax)
  folder.addInput(material, 'blendDst')
  folder.addInput(material, 'clipShadows')
  folder.addInput(material, 'depthTest')
  folder.addInput(material, 'depthWrite')
  folder.addInput(material, 'polygonOffset')
  folder.addInput(material, 'polygonOffsetFactor')
  folder.addInput(material, 'dithering')

  return () => folder.dispose()
}
