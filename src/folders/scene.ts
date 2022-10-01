import { disposeHelper } from '../lib/dispose'
import { pane } from '../pane'
import { storage } from '../lib/storage'
import { three } from '../three'

export const initSceneFolder = (scene: THREE.Scene) => {
  const sceneFolder = pane.addFolder({ index: 0, title: 'Scene' })
  const THREE = three()
  const grid = storage.get('grid') !== null
  const axes = storage.get('axes') !== null

  const params = {
    axes,
    fogColor: `#${scene.fog?.color.getHexString().toUpperCase()}`,
    grid,
    gridDivisions: storage.getNumber('gridDivisions') ?? 4,
    gridSize: storage.getNumber('gridSize') ?? 10,
  }

  const helpers = {
    axes: new THREE.AxesHelper(1_000),
    grid: new THREE.GridHelper(params.gridSize, params.gridDivisions),
  }

  helpers.grid.name = 'Grid helper'
  helpers.axes.name = 'Axes helper'

  if (grid) {
    scene.add(helpers.grid)
  }

  if (axes) {
    scene.add(helpers.axes)
  }

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
    disposeHelper(helpers.grid)

    helpers.grid = new THREE.GridHelper(params.gridSize, params.gridDivisions)
    scene.add(helpers.grid)

    storage.setNumber(param, params[param])
  }

  sceneFolder
    .addInput(params, 'grid', { label: 'grid' })
    .on('change', () => toggleHelper('grid'))

  sceneFolder
    .addInput(params, 'gridSize', { label: 'grid size' })
    .on('change', () => handleGridChange('gridSize'))

  sceneFolder
    .addInput(params, 'gridDivisions', { label: 'grid divisions', step: 1 })
    .on('change', () => handleGridChange('gridDivisions'))

  sceneFolder
    .addInput(params, 'axes', { label: 'axes' })
    .on('change', () => toggleHelper('axes'))

  if (scene.fog !== null) {
    const fogFolder = sceneFolder.addFolder({ title: 'Fog' })
    fogFolder.addInput(params, 'fogColor', {
      label: 'color',
    }).on('change', () => {
      scene.fog?.color.set(params.fogColor!)
    })

    if ('near' in scene.fog) {
      fogFolder.addInput(scene.fog, 'near')
    }

    if ('far' in scene.fog) {
      fogFolder.addInput(scene.fog, 'far')
    }
  }

  return () => {
    sceneFolder.dispose()
    scene.remove(helpers.grid, helpers.axes)
    disposeHelper(helpers.grid)
    disposeHelper(helpers.axes)
  }
}
