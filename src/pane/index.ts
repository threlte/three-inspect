import * as EssentialsPlugin from '@tweakpane/plugin-essentials'
import * as RotationPlugin from '@0b5vr/tweakpane-plugin-rotation'
import * as Tweakpane from 'tweakpane'
import * as panels from './panels'
import { save, storage } from '../storage'

export type Pane = Tweakpane.Pane | Tweakpane.FolderApi

const savedSelectedPanelTitle = storage.selectedPanelTitle
const storedState = (storage.expandedPanes ?? {}) as Record<string, boolean | undefined>
const folders: Pane[] = []
const paneContainers: HTMLElement[] = []

let isVisible = true

const addFolder = Tweakpane.FolderApi.prototype.addFolder
const dispose = Tweakpane.FolderApi.prototype.dispose

Tweakpane.FolderApi.prototype.addFolder = function (params: Tweakpane.FolderParams) {
  const folder = addFolder.call(this, {
    expanded: params.expanded ?? storedState[params.title] ?? false,
    ...params,
  })
  folders.push(folder)
  return folder
}

Tweakpane.FolderApi.prototype.dispose = function () {
  dispose.call(this)
  folders.splice(folders.indexOf(this), 1)
}

export const addPane = (title: string) => {
  const pane = new Tweakpane.Pane()
  pane.registerPlugin(EssentialsPlugin)
  pane.registerPlugin(RotationPlugin)
  pane.element.classList.add('pane')

  const parent = pane.element.parentElement

  if (parent === null) {
    throw new Error(`Parent of pane ${title} is null!`)
  }

  parent.style.transition = 'transform 300ms'
  parent.style.width = '300px'
  parent.style.zIndex = '1000'
  paneContainers.push(parent)
  panels.addPanelEntry(title, pane)

  if (savedSelectedPanelTitle === title) {
    panels.selectPanel(title)
  }

  return pane
}

const closeFolders = () => {
  for (const folder of folders) {
    folder.expanded = false
  }
}

export const pane = addPane('world')
if (!savedSelectedPanelTitle) {
  panels.selectPanel('world')
}

window.onbeforeunload = () => {
  const state: Record<string, boolean> = {}
  for (const { title, expanded } of folders) {
    if (title === undefined) {
      throw new Error('Pane has undefined title!')
    }

    state[title] = expanded
  }

  save('expandedPanes', state)
}

export const state = { controlling: false }

pane.element.addEventListener('mousedown', () => {
  state.controlling = true
}, { passive: true })

pane.element.addEventListener('mouseup', () => {
  state.controlling = false
}, { passive: true })

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
    break

  case 'x':
    closeFolders()
    break

  case '~':
    panels.selectPreviousPanel()
    break

  case '!':
    panels.selectNextPanel()
    break
  default:
    break
  }
})
