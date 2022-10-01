import type { Pane } from '../pane'
import { defaultMinMax } from '../constants'
import { three } from '../three'

export const addMaterialInputs = (pane: Pane, mesh: THREE.Mesh) => {
  const THREE = three()
  const material = mesh.material as THREE.Material
  const meshStandardMat = mesh.material as THREE.MeshStandardMaterial
  const meshPhysicalMat = mesh.material as THREE.MeshPhysicalMaterial

  const materialFolder = pane.addFolder({ title: `#${mesh.id} ${material.type}` })

  if (material.isMaterial) {
    materialFolder.addInput(material, 'depthTest')
    materialFolder.addInput(material, 'depthWrite')
    materialFolder.addInput(material, 'visible')
    materialFolder.addInput(material, 'side', {
      options: {
        BackSide: THREE.BackSide,
        DoubleSide: THREE.DoubleSide,
        FrontSide: THREE.FrontSide,
      },
    })
    materialFolder.addInput(material, 'transparent').on('change', () => {
      material.needsUpdate = true
    })
    materialFolder.addInput(material, 'opacity', defaultMinMax)
    materialFolder.addInput(material, 'alphaTest', defaultMinMax)
    materialFolder.addInput(material, 'blendDst')
    materialFolder.addInput(material, 'vertexColors')
  }

  if (meshStandardMat.isMeshStandardMaterial) {
    materialFolder.addSeparator()

    const params = {
      color: `#${meshStandardMat.color.getHexString()}`,
      emissive: `#${meshStandardMat.emissive.getHexString()}`,
    }

    materialFolder.addInput(params, 'color').on('change', () => {
      meshStandardMat.color.set(params.color)
    })
    materialFolder.addInput(params, 'emissive').on('change', () => {
      meshStandardMat.emissive.set(params.emissive)
    })
    materialFolder.addInput(meshStandardMat, 'emissiveIntensity', {
      max: 5,
      min: 0,
    })
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
  }

  /**
   * @TODO .isMeshPhysicalMaterial
   */
  if (meshPhysicalMat.reflectivity !== undefined) {
    materialFolder.addInput(meshPhysicalMat, 'reflectivity', defaultMinMax)
    materialFolder.addInput(meshPhysicalMat, 'clearcoat', defaultMinMax)
    materialFolder.addInput(meshPhysicalMat, 'clearcoatRoughness', defaultMinMax)
  }

  return () => {
    /* No-op */
  }
}
