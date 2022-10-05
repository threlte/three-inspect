import * as EssentialsPlugin from '@tweakpane/plugin-essentials'
import * as RotationPlugin from '@0b5vr/tweakpane-plugin-rotation'
import * as Tweakpane from 'tweakpane'
import * as panels from './panels'
import { storage } from '../lib/storage'

export type Pane = Tweakpane.Pane | Tweakpane.FolderApi

const folders: Pane[] = []
const paneContainers: HTMLElement[] = []

let isVisible = true

const selectedPane = storage.get('selectedPane')
const addFolder = Tweakpane.FolderApi.prototype.addFolder
const dispose = Tweakpane.FolderApi.prototype.dispose

Tweakpane.FolderApi.prototype.addFolder = function (params: Tweakpane.FolderParams) {
  const id = `${String(params.index ?? -1)}.${params.title}`

  const folder = addFolder.call(this, {
    expanded: storage.get(`panels.${id}`) !== null,
    ...params,
  })
  folders.push(folder)

  folder.element.id = id

  folder.on('fold', (event) => {
    const key = `panels.${id}`

    if (event.expanded) {
      storage.set(key, '')
    } else {
      storage.remove(key)
    }
  })

  return folder
}

Tweakpane.FolderApi.prototype.dispose = function () {
  dispose.call(this)
  folders.splice(folders.indexOf(this), 1)
}

export let pane: Pane

export const state = {
  controlling: false,
}

export const addPane = (title: string) => {
  const newPane = new Tweakpane.Pane()
  newPane.registerPlugin(EssentialsPlugin)
  newPane.registerPlugin(RotationPlugin)
  newPane.element.classList.add('pane')

  const parent = newPane.element.parentElement

  if (parent === null) {
    throw new Error(`Parent of pane ${title} is null!`)
  }

  parent.style.transition = 'transform 300ms'
  parent.style.width = '300px'
  parent.style.zIndex = '1000'
  paneContainers.push(parent)
  panels.addPanelEntry(title, newPane)

  if (selectedPane === title) {
    panels.selectPanel(title)
  }

  return newPane
}

const setControlled = () => {
  state.controlling = true
}

const setUncontrolled = () => {
  state.controlling = false
}

export const initPane = () => {
  pane = addPane('World')
  pane.element.addEventListener('mousedown', setControlled, { passive: true })
  pane.element.addEventListener('mouseup', setUncontrolled, { passive: true })

  return () => {
    pane.dispose()
  }
}

const closeFolders = () => {
  for (const folder of folders) {
    folder.expanded = false
  }
}

if (selectedPane === null) {
  panels.selectPanel('World')
}

document.addEventListener('keypress', (event) => {
  if (!event.shiftKey) {
    return
  }

  switch (event.key.toLowerCase()) {
  case 'a':
    for (const element of paneContainers) {
      element.style.transform = isVisible ? 'translate(110%, 0)' : ''
    }
    panels.element.style.transform = isVisible ? 'translate(0, -150%)' : ''
    isVisible = !isVisible
    return

  case 'x':
    closeFolders()
    return

  case '~':
    panels.selectPreviousPanel()
    return

  case '!':
    panels.selectNextPanel()
  }
})
