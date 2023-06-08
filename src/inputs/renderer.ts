import * as THREE from 'three'
import type { MonitorBindingApi } from 'tweakpane'
import type { Pane } from '../pane'
import { refs } from '../refs'

export const addRendererInputs = (pane: Pane) => {
  const { renderer } = refs

  const color = new THREE.Color()

  renderer.getClearColor(color)

  const colorParams = {
    clearColor: `#${color.getHexString().toUpperCase()}`,
  }

  pane.addInput(colorParams, 'clearColor').on('change', () => {
    renderer.setClearColor(colorParams.clearColor)
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

  const params = {
    calls: '',
    geometries: '',
    lines: '',
    points: '',
    textures: '',
    triangles: '',
  }

  const capabilities = {
    maxAnisotropy: renderer.capabilities.getMaxAnisotropy().toString(),
    maxAttributes: renderer.capabilities.maxAttributes.toFixed(0),
    maxCubemapSize: `${renderer.capabilities.maxCubemapSize} (h * w)`,
    maxFragmentUniforms: renderer.capabilities.maxFragmentUniforms.toFixed(0),
    maxTextureSize: `${renderer.capabilities.maxTextureSize.toFixed(0)} (h * w)`,
    maxTextures: renderer.capabilities.maxTextures.toFixed(0),
    maxVaryings: renderer.capabilities.maxVaryings.toFixed(0),
    maxVertexTextures: renderer.capabilities.maxVertexTextures.toFixed(0),
    maxVertexUniforms: renderer.capabilities.maxVertexUniforms.toFixed(0),
  }

  const interval = { interval: 1_000_000 }
  const monitors: MonitorBindingApi<string>[] = []

  monitors.push(
    pane.addMonitor(params, 'calls', interval),
    pane.addMonitor(params, 'geometries', interval),
    pane.addMonitor(params, 'lines', interval),
    pane.addMonitor(params, 'points', interval),
    pane.addMonitor(params, 'textures', interval),
    pane.addMonitor(params, 'triangles', interval)
  )

  pane.addSeparator()

  pane.addMonitor(capabilities, 'maxAnisotropy', interval)
  pane.addMonitor(capabilities, 'maxAttributes', interval)
  pane.addMonitor(capabilities, 'maxCubemapSize', interval)
  pane.addMonitor(capabilities, 'maxFragmentUniforms', interval)
  pane.addMonitor(capabilities, 'maxTextureSize', interval)
  pane.addMonitor(capabilities, 'maxTextures', interval)
  pane.addMonitor(capabilities, 'maxVaryings', interval)
  pane.addMonitor(capabilities, 'maxVertexTextures', interval)
  pane.addMonitor(capabilities, 'maxVertexUniforms', interval)
  pane.addMonitor(renderer.capabilities, 'precision', interval)

  const updateStats = () => {
    const { render, memory } = renderer.info
    params.calls = render.calls.toFixed(0)
    params.geometries = memory.geometries.toFixed(0)
    params.lines = render.lines.toFixed(0)
    params.points = render.points.toFixed(0)
    params.textures = memory.textures.toFixed(0)
    params.triangles = render.triangles.toFixed(0)

    for (let i = 0, l = monitors.length; i < l; i += 1) {
      monitors[i].refresh()
    }
  }

  const intervalId = setInterval(updateStats, 2000)
  updateStats()

  return () => clearInterval(intervalId)
}
