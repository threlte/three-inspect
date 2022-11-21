import type { Pane } from '../pane'
import { addRendererInputs } from '../inputs/renderer'
import { addTextureInputs } from '../inputs/texture'
import { refs } from '../refs'
import { singlePixelImage } from '../lib/image'
import { storage } from '../lib/storage'

const helpers: {
  axes: THREE.AxesHelper
  grid: THREE.GridHelper
} = {
  axes: undefined!,
  grid: undefined!,
}

const grid = storage.get('grid') !== null
const axes = storage.get('axes') !== null

const params = {
  axes,
  background: singlePixelImage,
  fogColor: '#000000',
  grid,
  gridDivisions: storage.getNumber('gridDivisions') ?? 4,
  gridSize: storage.getNumber('gridSize') ?? 10,
}

export const initSceneHelpers = () => {
  const { THREE, scene } = refs

  helpers.axes = new THREE.AxesHelper(1_000)
  helpers.axes.name = 'Axes helper'
  helpers.axes.userData.THREE_INSPECT_OMIT = true
  helpers.grid = new THREE.GridHelper(params.gridSize, params.gridDivisions)
  helpers.grid.name = 'Grid helper'
  helpers.grid.userData.THREE_INSPECT_OMIT = true

  if (grid) {
    scene.add(helpers.grid)
  }

  if (axes) {
    scene.add(helpers.axes)
  }

  return () => {
    scene.remove(helpers.grid, helpers.axes)
  }
}

export const addSceneInputs = (pane: Pane) => {
  const { THREE, scene } = refs
  const disposers: Disposer[] = []

  const toggleHelper = (helper: 'axes' | 'grid') => {
    scene[params[helper] ? 'add' : 'remove'](helpers[helper])

    if (params[helper]) {
      storage.set(helper, '')
    } else {
      storage.remove(helper)
    }
  }

  const handleGridChange = (param: 'gridSize' | 'gridDivisions') => {
    scene.remove(helpers.grid)
    helpers.grid.dispose()

    helpers.grid = new THREE.GridHelper(params.gridSize, params.gridDivisions)
    scene.add(helpers.grid)

    storage.setNumber(param, params[param])
  }

  pane
    .addInput(params, 'axes', { label: 'axes' })
    .on('change', () => toggleHelper('axes'))

  pane
    .addInput(params, 'grid', { label: 'grid' })
    .on('change', () => toggleHelper('grid'))

  pane
    .addInput(params, 'gridSize', { label: 'grid size' })
    .on('change', () => handleGridChange('gridSize'))

  pane
    .addInput(params, 'gridDivisions', { label: 'grid divisions', step: 1 })
    .on('change', () => handleGridChange('gridDivisions'))

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
    helpers.grid.dispose()
    helpers.axes.dispose()
  })
  return disposers
}
