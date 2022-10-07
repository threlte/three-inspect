import type { Pane } from 'tweakpane'
import { nav } from './elements'
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
  return () => {
    deletePanelEntries()
  }
}

export const selectPanel = (title: string) => {
  selectedTitle = title
  storage.set('selectedPane', title)

  selected?.classList.add('hidden')
  selectedButton?.classList.remove('selected')

  const button = nav.querySelector<HTMLButtonElement>(`[data-title="${title}"]`)

  if (button === null) {
    throw new Error(`panel of title ${title} does not exist!`)
  }

  selectedButton = button
  selectedButton.classList.add('selected')

  selected = paneMap.get(title)!.element
  selected.classList.remove('hidden')
}

const createButton = (title: string) => {
  const button = document.createElement('button')
  button.className = 'tp-fldv_b nav-button'
  button.dataset.title = title
  button.textContent = title
  button.addEventListener('click', () => {
    selectPanel(title)
  })
  return button
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
  nav.append(createButton(title))
  pane.element.classList.add('hidden')
}
