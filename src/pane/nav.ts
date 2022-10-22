import type { Pane } from 'tweakpane'
import { storage } from '../lib/storage'

let selectedTitle = ''
let selected: HTMLElement | undefined
let selectedButton: HTMLButtonElement | undefined

export const paneMap = new Map<string, Pane>()
export const paneTitles: string[] = []

const deletePanelEntries = () => {
  paneTitles.splice(0, paneTitles.length)
  paneMap.clear()
  nav.innerHTML = ''
}

export const initNav = () => {
  return deletePanelEntries
}

const selectNextPanel = () => {
  const index = paneTitles.indexOf(selectedTitle)
  selectPanel(paneTitles[index + 1] ?? paneTitles[0])
}

const selectPreviousPanel = () => {
  const index = paneTitles.indexOf(selectedTitle)
  selectPanel(paneTitles[index - 1] ?? paneTitles[paneTitles.length - 1])
}

export const navigate = (direction: 1 | -1) => {
  if (direction === 1) {
    selectNextPanel()
  } else {
    selectPreviousPanel()
  }
}

export const addPanelEntry = (title: string, pane: Pane) => {
  paneTitles.push(title)
  paneMap.set(title, pane)
  // nav.append(createButton(title))
  pane.element.classList.add('hidden')
}
