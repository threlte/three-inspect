import * as EssentialsPlugin from '@tweakpane/plugin-essentials'
import { removeUpdate, update } from '../update'
import { Pane } from 'tweakpane'

export const initStats = (renderer: THREE.WebGLRenderer) => {
  const stats = new Pane()
  stats.element.parentElement!.classList.add('pane-left')
  stats.registerPlugin(EssentialsPlugin)

  const mb = 1_048_576
  const { memory } = performance as unknown as { memory: undefined | {
    usedJSHeapSize: number
    jsHeapSizeLimit: number
  } }

  const parameters = {
    memory: memory ? memory.usedJSHeapSize / mb : 0,
    time: '',
  }

  const start = performance.now()
  let total = 0

  const updateTime = () => {
    const now = performance.now()
    total = (now - start) / 1000

    const seconds = (total % 60) | 0
    const minutes = (total / 60) | 0
    const hours = (total / 60 / 60) | 0

    parameters.time = `${
      hours < 10 ? `0${hours}` : hours
    }:${
      minutes < 10 ? `0${minutes}` : minutes
    }:${
      seconds < 10 ? `0${seconds}` : seconds
    }`
  }

  updateTime()
  const timeId = setInterval(updateTime, 1000)

  stats.addMonitor(parameters, 'time', {
    interval: 1000,
  })

  const fpsGraph = stats.addBlade({
    label: 'fps',
    lineCount: 2,
    view: 'fpsgraph',
  })

  let memoryId = -1
  if (memory) {
    stats.addMonitor(parameters, 'memory', {
      max: memory.jsHeapSizeLimit / mb,
      min: 0,
      view: 'graph',
    })

    memoryId = setInterval(() => {
      parameters.memory = memory.usedJSHeapSize / mb
    }, 3000)
  }

  if ('info' in renderer) {
    const folder = stats.addFolder({ title: 'Renderer' })
    folder.addMonitor(renderer.info.memory, 'geometries', { interval: 3_000 })
    folder.addMonitor(renderer.info.memory, 'textures', { interval: 3_000 })
    folder.addMonitor(renderer.info.render, 'calls', { interval: 3_000 })
    folder.addMonitor(renderer.info.render, 'lines', { interval: 3_000 })
    folder.addMonitor(renderer.info.render, 'points', { interval: 3_000 })
    folder.addMonitor(renderer.info.render, 'triangles', { interval: 3_000 })
  }

  const tick = () => {
    const graph = fpsGraph as unknown as { begin(): void; end(): void }
    graph.end()
    graph.begin()
  }

  update(tick)

  const dispose = () => {
    stats.dispose()
    clearInterval(timeId)
    clearInterval(memoryId)
    removeUpdate(tick)
  }

  return { stats, dispose }
}
