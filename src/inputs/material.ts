import * as THREE from 'three'
import { Pane, addFolder, deleteFolder } from '../pane'
import { defaultMinMax } from '../constants'

export const addMaterialInputs = (pane: Pane, mesh: THREE.Mesh) => {
  const { material } = mesh
  const materialFolder = addFolder(pane, `#${mesh.id} ${(material as THREE.Material).type}`)

  if (material instanceof THREE.Material) {
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
  }

  if (material instanceof THREE.MeshStandardMaterial) {
    materialFolder.addSeparator()

    const params = {
      color: `#${material.color.getHexString()}`,
      emissive: `#${material.emissive.getHexString()}`,
    }

    materialFolder.addInput(params, 'color').on('change', () => {
      material.color.set(params.color)
    })
    materialFolder.addInput(params, 'emissive').on('change', () => {
      material.emissive.set(params.emissive)
    })
    materialFolder.addInput(material, 'emissiveIntensity', {
      max: 5,
      min: 0,
    })
    materialFolder.addInput(material, 'roughness', defaultMinMax)
    materialFolder.addInput(material, 'metalness', defaultMinMax)
    materialFolder.addInput(material, 'flatShading')
    materialFolder.addInput(material, 'wireframe')
    materialFolder.addInput(material, 'vertexColors')
    materialFolder.addInput(material, 'fog')
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

  if (material instanceof THREE.MeshPhysicalMaterial) {
    materialFolder.addInput(material, 'reflectivity', defaultMinMax)
    materialFolder.addInput(material, 'clearcoat', defaultMinMax)
    materialFolder.addInput(material, 'clearcoatRoughness', defaultMinMax)
  }

  const dispose = () => {
    deleteFolder(materialFolder)
  }

  return dispose
}
