import type { Pane } from '../pane'
import { three } from '../three'

export const addRendererInputs = (pane: Pane, renderer: THREE.WebGLRenderer) => {
  const THREE = three()
  const color = new THREE.Color()

  renderer.getClearColor(color)

  const params = {
    clearColor: `#${color.getHexString().toUpperCase()}`,
    maxAnisotropy: renderer.capabilities.getMaxAnisotropy(),
  }

  pane.addInput(params, 'clearColor').on('change', () => {
    renderer.setClearColor(params.clearColor)
  })

  const shadowmapChange = () => {
    renderer.shadowMap.needsUpdate = true
  }

  pane.addSeparator()
  pane
    .addInput(renderer.shadowMap, 'enabled', { label: 'shadowmap' })
    .on('change', shadowmapChange)
  pane
    .addInput(renderer.shadowMap, 'autoUpdate')
    .on('change', shadowmapChange)
  pane.addInput(renderer.shadowMap, 'type', {
    options: {
      'Basic': THREE.BasicShadowMap,
      'PCF': THREE.PCFShadowMap,
      'PCF Soft': THREE.PCFSoftShadowMap,
      'VSM': THREE.VSMShadowMap,
    },
  }).on('change', () => {
    renderer.shadowMap.needsUpdate = true
  })

  pane.addSeparator()
  pane.addInput(renderer, 'toneMapping', {
    options: {
      ACESFilmic: THREE.ACESFilmicToneMapping,
      Cineon: THREE.CineonToneMapping,
      Custom: THREE.CustomToneMapping,
      Linear: THREE.LinearToneMapping,
      None: THREE.NoToneMapping,
      Reinhard: THREE.ReinhardToneMapping,
    },
  })
  pane.addInput(renderer, 'toneMappingExposure', { label: 'exposure' })

  pane.addSeparator()
  const shortInterval = { interval: 3_000 }
  pane.addMonitor(renderer.info.memory, 'geometries', shortInterval)
  pane.addMonitor(renderer.info.memory, 'textures', shortInterval)
  pane.addMonitor(renderer.info.render, 'calls', shortInterval)
  pane.addMonitor(renderer.info.render, 'lines', shortInterval)
  pane.addMonitor(renderer.info.render, 'points', shortInterval)
  pane.addMonitor(renderer.info.render, 'triangles', shortInterval)

  pane.addSeparator()
  const longInterval = { interval: 100_000 }
  pane.addMonitor(params, 'maxAnisotropy', longInterval)
  pane.addMonitor(renderer.capabilities, 'maxAttributes', longInterval)
  pane.addMonitor(renderer.capabilities, 'maxCubemapSize', longInterval)
  pane.addMonitor(renderer.capabilities, 'maxFragmentUniforms', longInterval)
  pane.addMonitor(renderer.capabilities, 'maxTextureSize', longInterval)
  pane.addMonitor(renderer.capabilities, 'maxTextures', longInterval)
  pane.addMonitor(renderer.capabilities, 'maxVaryings', longInterval)
  pane.addMonitor(renderer.capabilities, 'maxVertexTextures', longInterval)
  pane.addMonitor(renderer.capabilities, 'maxVertexUniforms', longInterval)
  pane.addMonitor(renderer.capabilities, 'precision', longInterval)

  return () => null
}
