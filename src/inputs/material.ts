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

  const params = {
    color: '',
    emissive: '',
  }

  const updateMaterial = () => {
    material.needsUpdate = true
  }

  const addColorInput = () => {
    const mat = material as THREE.MeshBasicMaterial
    params.color = `#${mat.color.getHexString()}`
    folder.addInput(params, 'color').on('change', () => mat.color.set(params.color))
  }

  const addEmissiveInput = () => {
    const mat = material as THREE.MeshLambertMaterial
    params.emissive = `#${mat.emissive.getHexString()}`
    folder.addInput(params, 'emissive').on('change', () => mat.emissive.set(params.emissive))
    folder.addInput(mat, 'emissiveIntensity', { min: 0 })
  }

  folder.addInput(material, 'visible')
  folder.addInput(material, 'side', { options: sideOptions })
  folder.addInput(material, 'transparent').on('change', updateMaterial)
  folder.addInput(material, 'opacity', defaultMinMax)
  folder.addInput(material, 'vertexColors')
  folder.addSeparator()

  /**
   * LineBasicMaterial
   */
  if (material.type === 'LineBasicMaterial' || material.type === 'LineDashedMaterial') {
    addColorInput()

    const mat = material as THREE.LineBasicMaterial | THREE.LineDashedMaterial
    folder.addInput(mat, 'fog')
    folder.addInput(mat, 'linewidth')

  /**
   * MeshBasicMaterial
   */
  } else if (material.type === 'MeshBasicMaterial') {
    addColorInput()

    const mat = material as THREE.MeshBasicMaterial
    folder.addInput(mat, 'fog')
    folder.addInput(mat, 'reflectivity', defaultMinMax)
    folder.addInput(mat, 'refractionRatio', defaultMinMax)
    folder.addInput(mat, 'wireframe')

  /**
   * MeshDepthMaterial
   */
  } else if (material.type === 'MeshDepthMaterial') {
    folder.addInput(material as THREE.MeshDepthMaterial, 'fog')

  /**
   * MeshLambertMaterial
   */
  } else if (material.type === 'MeshLambertMaterial') {
    addColorInput()
    addEmissiveInput()

    const mat = material as THREE.MeshLambertMaterial
    folder.addInput(mat, 'flatShading').on('change', updateMaterial)
    folder.addInput(mat, 'fog')
    folder.addInput(mat, 'reflectivity', defaultMinMax)
    folder.addInput(mat, 'refractionRatio', defaultMinMax)
    folder.addInput(mat, 'wireframe')

  /**
   * MeshPhongMaterial
   */
  } else if (material.type === 'MeshPhongMaterial') {
    addColorInput()
    addEmissiveInput()

    const mat = material as THREE.MeshPhongMaterial
    folder.addInput(mat, 'flatShading').on('change', updateMaterial)
    folder.addInput(mat, 'fog')
    folder.addInput(mat, 'reflectivity', defaultMinMax)
    folder.addInput(mat, 'refractionRatio', defaultMinMax)
    folder.addInput(mat, 'shininess', defaultMinMax)
    folder.addInput(mat, 'wireframe')

  /**
   * MeshStandardMaterial / MeshPhysicalMaterial
   */
  } else if (material.type === 'MeshStandardMaterial' || material.type === 'MeshPhysicalMaterial') {
    addColorInput()
    addEmissiveInput()

    const mat = material as THREE.MeshStandardMaterial
    folder.addInput(mat, 'roughness', defaultMinMax)
    folder.addInput(mat, 'metalness', defaultMinMax)
    folder.addInput(mat, 'flatShading').on('change', updateMaterial)
    folder.addInput(mat, 'fog')
    folder.addInput(mat, 'wireframe')
    folder.addInput(mat, 'envMapIntensity')

    if (material.type === 'MeshPhysicalMaterial') {
      const mat2 = material as THREE.MeshPhysicalMaterial
      folder.addInput(mat2, 'reflectivity', defaultMinMax)
      folder.addInput(mat2, 'clearcoat', defaultMinMax)
      folder.addInput(mat2, 'clearcoatRoughness', defaultMinMax)
    }

  /**
   * ShaderMaterial
   */
  } else if (material.type === 'ShaderMaterial') {
    const mat = material as THREE.ShaderMaterial
    const shaderMatParams = {
      uniforms: JSON.stringify(mat.uniforms, null, 2),
    }

    folder.addInput(shaderMatParams, 'uniforms', { view: 'textarea' }).on('change', () => {
      try {
        mat.uniforms = JSON.parse(shaderMatParams.uniforms)
        updateMaterial()
      } catch {
        /* Do nothing */
      }
    })
    folder.addInput(mat, 'vertexShader', { view: 'textarea' }).on('change', updateMaterial)
    folder.addInput(mat, 'fragmentShader', { view: 'textarea' }).on('change', updateMaterial)
  }

  /**
   * Textures
   */
  if (
    material.type === 'MeshBasicMaterial' ||
    material.type === 'MeshLambertMaterial' ||
    material.type === 'MeshPhongMaterial' ||
    material.type === 'MeshStandardMaterial' ||
    material.type === 'MeshPhysicalMaterial'
  ) {
    const mat = material as THREE.MeshPhysicalMaterial

    /**
     * @TODO add:
     * - envMap
     */
    folder.addSeparator()
    addTextureInputs(folder, mat, 'map')
    addTextureInputs(folder, mat, 'alphaMap')
    addTextureInputs(folder, mat, 'aoMap')
    folder.addInput(mat, 'aoMapIntensity', defaultMinMax)
    addTextureInputs(folder, mat, 'lightMap')
    folder.addInput(mat, 'lightMapIntensity', defaultMinMax)

    if (
      material.type === 'MeshLambertMaterial' ||
      material.type === 'MeshPhongMaterial' ||
      material.type === 'MeshStandardMaterial' ||
      material.type === 'MeshPhysicalMaterial'
    ) {
      addTextureInputs(folder, mat, 'bumpMap')
      folder.addInput(mat, 'bumpScale', defaultMinMax)
      addTextureInputs(folder, mat, 'displacementMap')
      folder.addInput(mat, 'displacementScale')
      folder.addInput(mat, 'displacementBias')
      addTextureInputs(folder, mat, 'emissiveMap')
      addTextureInputs(folder, mat, 'normalMap')
      folder.addInput(mat, 'normalMapType', { options: normalMapTypeOptions })
    }

    if (material.type === 'MeshStandardMaterial' || material.type === 'MeshPhysicalMaterial') {
      addTextureInputs(folder, mat, 'metalnessMap')
      addTextureInputs(folder, mat, 'roughnessMap')
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
