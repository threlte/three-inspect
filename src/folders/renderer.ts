import { type Pane, pane } from '../pane'
import { three } from '../three'

export const initRendererFolder = (renderer: THREE.WebGLRenderer) => {
  const THREE = three()
  const color = new THREE.Color()
  const rendererFolder = pane.addFolder({ index: 1, title: 'Renderer' })

  renderer.getClearColor(color)

  const params = {
    clearColor: `#${color.getHexString().toUpperCase()}`,
    maxAnisotropy: renderer.capabilities.getMaxAnisotropy(),
  }

  rendererFolder.addInput(params, 'clearColor').on('change', () => {
    renderer.setClearColor(params.clearColor)
  })

  const shadowmapChange = () => {
    renderer.shadowMap.needsUpdate = true
  }

  rendererFolder.addSeparator()
  rendererFolder
    .addInput(renderer.shadowMap, 'enabled', { label: 'shadowmap' })
    .on('change', shadowmapChange)
  rendererFolder
    .addInput(renderer.shadowMap, 'autoUpdate')
    .on('change', shadowmapChange)
  rendererFolder.addInput(renderer.shadowMap, 'type', {
    options: {
      'Basic': THREE.BasicShadowMap,
      'PCF': THREE.PCFShadowMap,
      'PCF Soft': THREE.PCFSoftShadowMap,
      'VSM': THREE.VSMShadowMap,
    },
  }).on('change', () => {
    renderer.shadowMap.needsUpdate = true
  })

  rendererFolder.addSeparator()
  rendererFolder.addInput(renderer, 'toneMapping', {
    options: {
      None: THREE.NoToneMapping,
      Linear: THREE.LinearToneMapping,
      Reinhard: THREE.ReinhardToneMapping,
      Cineon: THREE.CineonToneMapping,
      ACESFilmic: THREE.ACESFilmicToneMapping,
      Custom: THREE.CustomToneMapping,
    },
  })
  rendererFolder.addInput(renderer, 'toneMappingExposure', { label: 'exposure' })

  let infoFolder: Pane | undefined

  if ('info' in renderer) {
    infoFolder = rendererFolder.addFolder({ title: 'Info' })
    const shortInterval = { interval: 3_000 }

    infoFolder.addMonitor(renderer.info.memory, 'geometries', shortInterval)
    infoFolder.addMonitor(renderer.info.memory, 'textures', shortInterval)
    infoFolder.addMonitor(renderer.info.render, 'calls', shortInterval)
    infoFolder.addMonitor(renderer.info.render, 'lines', shortInterval)
    infoFolder.addMonitor(renderer.info.render, 'points', shortInterval)
    infoFolder.addMonitor(renderer.info.render, 'triangles', shortInterval)
  }

  const longInterval = { interval: 100_000 }
  const capabilityFolder = rendererFolder.addFolder({ title: 'Capabilities' })
  capabilityFolder.addMonitor(params, 'maxAnisotropy', longInterval)
  capabilityFolder.addMonitor(renderer.capabilities, 'maxAttributes', longInterval)
  capabilityFolder.addMonitor(renderer.capabilities, 'maxCubemapSize', longInterval)
  capabilityFolder.addMonitor(renderer.capabilities, 'maxFragmentUniforms', longInterval)
  capabilityFolder.addMonitor(renderer.capabilities, 'maxTextureSize', longInterval)
  capabilityFolder.addMonitor(renderer.capabilities, 'maxTextures', longInterval)
  capabilityFolder.addMonitor(renderer.capabilities, 'maxVaryings', longInterval)
  capabilityFolder.addMonitor(renderer.capabilities, 'maxVertexTextures', longInterval)
  capabilityFolder.addMonitor(renderer.capabilities, 'maxVertexUniforms', longInterval)
  capabilityFolder.addMonitor(renderer.capabilities, 'precision', longInterval)

  return () => {
    infoFolder?.dispose()
    rendererFolder.dispose()
  }
}
