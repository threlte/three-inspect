/* eslint-disable no-use-before-define */
import type { Pane } from '../pane'
import { singlePixelImage } from '../lib/image'
import { three } from '../three'

type Textures =
  'alphaMap' | 'aoMap' | 'bumpMap' |
  'displacementMap' | 'lightMap' |
  'emissiveMap' | 'map' | 'metalnessMap' | 'normalMap' | 'roughnessMap' |
  'background'

type TextureObjects =
  | THREE.Scene
  | THREE.MeshBasicMaterial
  | THREE.MeshStandardMaterial

export const addTextureInputs = (pane: Pane, object: TextureObjects, property: Textures) => {
  const THREE = three()
  // @ts-expect-error @TODO Type this better
  const tex = object[property] as THREE.Texture | null

  const disposer = {
    current: () => {
      /* No-op */
    },
  }

  const wrapOptions = {
    ClampToEdgeWrapping: THREE.ClampToEdgeWrapping,
    MirroredRepeatWrapping: THREE.MirroredRepeatWrapping,
    RepeatWrapping: THREE.RepeatWrapping,
  }

  const magFilterOptions = {
    LinearFilter: THREE.LinearFilter,
    NearestFilter: THREE.NearestFilter,
  }

  const minFilterOptions = {
    ...magFilterOptions,
    LinearMipmapLinearFilter: THREE.LinearMipmapLinearFilter,
    LinearMipmapNearestFilter: THREE.LinearMipmapNearestFilter,
    NearestMipmapLinearFilter: THREE.NearestMipmapLinearFilter,
    NearestMipmapNearestFilter: THREE.NearestMipmapNearestFilter,
  }

  const anisotropyOptions = {
    0: 0,
    16: 16,
    2: 2,
    4: 4,
    8: 8,
  }

  const formatOptions = {
    AlphaFormat: THREE.AlphaFormat,
    DepthFormat: THREE.DepthFormat,
    DepthStencilFormat: THREE.DepthStencilFormat,
    LuminanceAlphaFormat: THREE.LuminanceAlphaFormat,
    LuminanceFormat: THREE.LuminanceFormat,
    RGBAFormat: THREE.RGBAFormat,
    RGBAIntegerFormat: THREE.RGBAIntegerFormat,
    RGFormat: THREE.RGFormat,
    RGIntegerFormat: THREE.RGIntegerFormat,
    RedFormat: THREE.RedFormat,
    RedIntegerFormat: THREE.RedIntegerFormat,
  }

  const encodingOptions = {
    BasicDepthPacking: THREE.BasicDepthPacking,
    LinearEncoding: THREE.LinearEncoding,
    RGBADepthPacking: THREE.RGBADepthPacking,
    sRGBEncoding: THREE.sRGBEncoding,
  }

  const params = {
    map: tex?.image ?? singlePixelImage,
  }

  const addInputs = (texture: THREE.Texture) => {
    folder.hidden = false
    folder.title = `${texture.name} (Texture)`.trim()

    const updateTexture = () => (texture.needsUpdate = true)

    folder.addInput(texture, 'wrapS', { options: wrapOptions }).on('change', updateTexture)
    folder.addInput(texture, 'wrapT', { options: wrapOptions }).on('change', updateTexture)
    folder.addInput(texture, 'magFilter', { options: magFilterOptions })
    folder.addInput(texture, 'minFilter', { options: minFilterOptions })
    folder.addInput(texture, 'offset', { step: 0.01 })
    folder.addInput(texture, 'rotation', { step: 0.01 })
    folder.addInput(texture, 'anisotropy', { options: anisotropyOptions }).on('change', updateTexture)
    folder.addInput(texture, 'format', { options: formatOptions }).on('change', updateTexture)
    folder.addInput(texture, 'repeat', { x: { step: 1 }, y: { step: 1 } })
    folder.addInput(texture, 'center')
    folder.addInput(texture, 'flipY')
    folder.addInput(texture, 'encoding', { options: encodingOptions }).on('change', () => {
      updateTexture()
      if (object instanceof THREE.Material) {
        object.needsUpdate = true
      }
    })

    disposer.current = () => folder.children.forEach((child) => child.dispose())
  }

  pane.addInput(params, 'map', {
    label: property,
    view: 'input-image',
  }).on('change', ({ value }) => {
    if (value.src === singlePixelImage.src) {
      return
    }

    if (value.src === tex?.image.src) {
      return
    }

    // @ts-expect-error @TODO Type this better
    const oldTexture = object[property] as THREE.Texture | null
    oldTexture?.dispose()

    const texture = new THREE.Texture(value)

    // @ts-expect-error @TODO Type this better
    object[property] = texture
    texture.needsUpdate = true

    if (object instanceof THREE.Material) {
      object.needsUpdate = true
    }

    disposer.current()
    addInputs(texture)
  })

  const folder = pane.addFolder({ hidden: true, title: '' })

  if (tex) {
    addInputs(tex)
  }

  return () => disposer.current()
}
