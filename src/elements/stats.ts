import * as EssentialsPlugin from '@tweakpane/plugin-essentials'
import { removeUpdate, update } from '../update'
import { Pane } from 'tweakpane'

type PerformanceMemory = Performance & {
  memory: undefined | {
    usedJSHeapSize: number
    jsHeapSizeLimit: number
  }
}

export const initStats = (root: HTMLElement) => {
  const container = document.createElement('div')
  container.className = 'sticky bottom-0 h-[105px]'
  root.append(container)

  const stats = new Pane({ container })
  stats.registerPlugin(EssentialsPlugin)

  stats.addSeparator()

  const mb = 1_048_576
  const { memory } = performance as PerformanceMemory

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

  const tick = () => {
    const graph = fpsGraph as unknown as { begin(): void; end(): void }
    graph.end()
    graph.begin()
  }

  update(tick)

  return () => {
    stats.dispose()
    clearInterval(timeId)
    clearInterval(memoryId)
    removeUpdate(tick)
  }
}
