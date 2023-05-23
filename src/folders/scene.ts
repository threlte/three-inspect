import * as THREE from 'three'
import { GridHelper, load, save } from 'trzy'
import type { Pane } from '../pane'
import { addRendererInputs } from '../inputs/renderer'
import { addTextureInputs } from '../inputs/texture'
import { refs } from '../refs'
import { singlePixelImage } from '../lib/image'

const params = {
  axes: Boolean(load('three-inspect.axes')),
  background: singlePixelImage,
  fogColor: '#000000',
  grid: Boolean(load('three-inspect.grid')),
  gridCellSize: load<number>('three-inspect.gridCellSize') ?? 1,
  gridColor: load<string>('three-inspect.gridColor') ?? '#ffffff',
  gridDistance: load<number>('three-inspect.gridDistance') ?? 100,
  gridLargeCellSize: load<number>('three-inspect.largeCellSize') ?? 10,
}

const color = new THREE.Color()

const helpers: {
  axes: THREE.AxesHelper
  grid: GridHelper
} = {
  axes: new THREE.AxesHelper(1_000),
  grid: new GridHelper(params.gridCellSize, params.gridLargeCellSize, params.gridColor, params.gridDistance),
}

export const initSceneHelpers = () => {
  const { scene } = refs

  helpers.axes = new THREE.AxesHelper(1_000)
  helpers.axes.name = 'Axes helper'
  helpers.axes.userData.THREE_INSPECT_OMIT = true
  helpers.grid.name = 'Grid helper'
  helpers.grid.userData.THREE_INSPECT_OMIT = true

  if (params.grid) {
    scene.add(helpers.grid)
  }

  if (params.axes) {
    scene.add(helpers.axes)
  }

  return () => {
    scene.remove(helpers.grid, helpers.axes)
  }
}

export const addSceneInputs = (pane: Pane) => {
  const { scene } = refs
  const disposers: Disposer[] = []

  const toggleHelper = (helper: 'axes' | 'grid') => {
    scene[params[helper] ? 'add' : 'remove'](helpers[helper])

    if (params[helper]) {
      save(`three-inspect.${helper}`, true)
    } else {
      save(`three-inspect.${helper}`, false)
    }
  }

  const handleGridChange = (param: 'gridCellSize' | 'gridLargeCellSize' | 'gridColor' | 'gridDistance') => {
    color.set(params.gridColor)

    helpers.grid.cellSize = params.gridCellSize
    helpers.grid.largeCellSize = params.gridLargeCellSize

    if (helpers.grid.color instanceof THREE.Color) {
      helpers.grid.color.copy(color)
    } else {
      helpers.grid.color = color
    }

    helpers.grid.distance = params.gridDistance

    save(param, params[param])
  }

  pane
    .addInput(params, 'axes', { label: 'axes' })
    .on('change', () => toggleHelper('axes'))

  pane
    .addInput(params, 'grid', { label: 'grid' })
    .on('change', () => toggleHelper('grid'))

  pane
    .addInput(params, 'gridCellSize', { label: 'cell size' })
    .on('change', () => handleGridChange('gridCellSize'))

  pane
    .addInput(params, 'gridLargeCellSize', { label: 'large cell size', step: 1 })
    .on('change', () => handleGridChange('gridLargeCellSize'))

  pane
    .addInput(params, 'gridColor', { label: 'color', step: 1 })
    .on('change', () => handleGridChange('gridColor'))

  pane
    .addInput(params, 'gridDistance', { label: 'distance', step: 1 })
    .on('change', () => handleGridChange('gridDistance'))

  if (scene.fog !== null) {
    params.fogColor = `#${scene.fog.color.getHexString().toUpperCase()}`

    const fogFolder = pane.addFolder({ title: 'Fog' })
    fogFolder.addInput(params, 'fogColor', {
      label: 'color',
    }).on('change', () => {
      scene.fog?.color.set(params.fogColor)
    })

    if ('near' in scene.fog) {
      fogFolder.addInput(scene.fog, 'near')
    }

    if ('far' in scene.fog) {
      fogFolder.addInput(scene.fog, 'far')
    }
  }

  pane.addSeparator()

  disposers.push(addTextureInputs(pane, scene, 'background'))

  pane.addSeparator()

  disposers.push(addRendererInputs(pane))
  disposers.push(() => {
    scene.remove(helpers.grid)
    helpers.axes.dispose()
  })
  return disposers
}
