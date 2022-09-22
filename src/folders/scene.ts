import * as THREE from 'three'
import { addFolder, pane } from '../pane'
import { save, storage } from '../storage'

export const initSceneFolder = (scene: THREE.Scene) => {
  const sceneFolder = addFolder(pane, 'scene', 0)

  const params = {
    grid: storage.grid as boolean ?? false,
    gridSize: storage.gridSize as number ?? 10,
    gridDivisions: storage.gridDivisions as number ?? 1,
    axes: storage.axes as boolean ?? false,
    fogColor: `#${scene.fog?.color.getHexString().toUpperCase()}`,
  }

  const helpers = {
    grid: new THREE.GridHelper(params.gridSize, params.gridDivisions),
    axes: new THREE.AxesHelper(1_000),
  }
  helpers.grid.name = 'Grid helper'
  helpers.axes.name = 'Axes helper'

  if (storage.grid) {
    scene.add(helpers.grid)
  }
  
  if (storage.axes) {
    scene.add(helpers.axes)
  }

  const toggleHelper = (helper: 'axes' | 'grid') => {
    scene[params[helper] ? 'add' : 'remove'](helpers[helper])
    save(helper, params[helper])
  }

  const handleGridChange = (param: 'gridSize' | 'gridDivisions') => {
    scene.remove(helpers.grid)
    helpers.grid.geometry.dispose()
    if (helpers.grid.material instanceof THREE.Material) {
      helpers.grid.material.dispose()
    }
    helpers.grid = new THREE.GridHelper(params.gridSize, params.gridDivisions)
    scene.add(helpers.grid)
    save(param, params[param])
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
  
  if (scene.fog instanceof THREE.Fog) {
    const fogFolder = addFolder(sceneFolder, 'fog')
    fogFolder.addInput(params, 'fogColor', {
      label: 'color',
    }).on('change', () => {
      scene.fog!.color.set(params.fogColor!)
    })
  
    fogFolder.addInput(scene.fog, 'near')
    fogFolder.addInput(scene.fog, 'far')
  }
}
