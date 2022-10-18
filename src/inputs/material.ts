import type { Pane } from '../pane'
import { defaultMinMax } from '../constants'
import { three } from '../three'

export const addMaterialInputs = (pane: Pane, mesh: THREE.Mesh) => {
  const THREE = three()
  const material = mesh.material as THREE.Material
  const materialFolder = pane.addFolder({ index: mesh.id, title: `${material.name} (${material.type})` })

  const lineBasicMat = material as THREE.LineBasicMaterial
  const meshStandardMat = mesh.material as THREE.MeshStandardMaterial
  const meshPhysicalMat = mesh.material as THREE.MeshPhysicalMaterial

  const sideOptions = {
    options: {
      BackSide: THREE.BackSide,
      DoubleSide: THREE.DoubleSide,
      FrontSide: THREE.FrontSide,
    },
  }

  const params = {
    color: '',
    emissive: '',
  }

  const handleColorChange = () => {
    meshStandardMat.color.set(params.color)
  }

  if ('isMaterial' in material) {
    materialFolder.addInput(material, 'alphaTest', defaultMinMax)
    materialFolder.addInput(material, 'blendDst')
    materialFolder.addInput(material, 'clipShadows')
    materialFolder.addInput(material, 'depthTest')
    materialFolder.addInput(material, 'depthWrite')
    materialFolder.addInput(material, 'opacity', defaultMinMax)
    materialFolder.addInput(material, 'polygonOffset')
    materialFolder.addInput(material, 'polygonOffsetFactor')
    materialFolder.addInput(material, 'dithering')
    materialFolder.addInput(material, 'visible')
    materialFolder.addInput(material, 'side', sideOptions)
    materialFolder.addInput(material, 'transparent').on('change', () => {
      material.needsUpdate = true
    })
    materialFolder.addInput(material, 'vertexColors')
  }

  /**
   * LineBasicMaterial
   */
  if (lineBasicMat.type === 'LineBasicMaterial') {
    params.color = `#${lineBasicMat.color.getHexString()}`

    materialFolder.addSeparator()
    materialFolder.addInput(params, 'color').on('change', handleColorChange)
    materialFolder.addInput(lineBasicMat, 'linewidth')

  /**
   * MeshStandardMaterial / MeshPhysicalMaterial
   */
  } else if (meshStandardMat.isMeshStandardMaterial) {
    params.color = `#${meshStandardMat.color.getHexString()}`
    params.emissive = `#${meshStandardMat.emissive.getHexString()}`

    materialFolder.addSeparator()
    materialFolder.addInput(params, 'color').on('change', handleColorChange)
    materialFolder.addInput(params, 'emissive').on('change', () => {
      meshStandardMat.emissive.set(params.emissive)
    })
    materialFolder.addInput(meshStandardMat, 'emissiveIntensity', { max: 5, min: 0 })
    materialFolder.addInput(meshStandardMat, 'roughness', defaultMinMax)
    materialFolder.addInput(meshStandardMat, 'metalness', defaultMinMax)
    materialFolder.addInput(meshStandardMat, 'flatShading')
    materialFolder.addInput(meshStandardMat, 'wireframe')
    materialFolder.addInput(meshStandardMat, 'fog')
    /**
     * @TODO add:
     * - alphaMap
     * - aoMap
     * - aoMapIntensity
     * - bumpMap
     * - bumpScale
     * - displacementMap
     * - displacementScale
     * - displacementBias
     * - emissiveMap
     * - envMaps, map, roughnessMap, alphaMap
     */

    // @ts-expect-error @TODO this is not typed
    if (meshPhysicalMat.isMeshPhysicalMaterial) {
      materialFolder.addInput(meshPhysicalMat, 'reflectivity', defaultMinMax)
      materialFolder.addInput(meshPhysicalMat, 'clearcoat', defaultMinMax)
      materialFolder.addInput(meshPhysicalMat, 'clearcoatRoughness', defaultMinMax)
    }
  }

  return () => {
    materialFolder.dispose()
  }
}
