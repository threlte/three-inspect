import type { Pane } from 'tweakpane'
import css from './index.css'
import { save } from '../storage'

const style = document.createElement('style')
style.innerHTML = css
document.head.append(style)

let selectedTitle = ''
let selected: HTMLElement | undefined
let selectedButton: HTMLButtonElement | undefined

export const element = document.createElement('div')
element.className = 'panels tp-rotv'
document.body.append(element)

export const paneMap = new Map<string, Pane>()
export const paneTitles: string[] = []

export const selectPanel = (title: string) => {
  selectedTitle = title
  save('selectedPanelTitle', title)

  selected?.classList.add('hidden')
  selectedButton?.classList.remove('selected')

  const button = element.querySelector<HTMLButtonElement>(`[data-title="${title}"]`)

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
  button.className = 'tp-fldv_b panels-button'
  button.dataset.title = title
  button.textContent = title
  button.addEventListener('click', () => {
    selectPanel(title)
  })
  return button
}

export const selectNextPanel = () => {
  const index = paneTitles.indexOf(selectedTitle)
  selectPanel(paneTitles[index + 1] ?? paneTitles[0])
}

export const selectPreviousPanel = () => {
  const index = paneTitles.indexOf(selectedTitle)
  selectPanel(paneTitles[index - 1] ?? paneTitles[paneTitles.length - 1])
}

export const addPanelEntry = (title: string, pane: Pane) => {
  paneTitles.push(title)
  paneMap.set(title, pane)
  element.append(createButton(title))
  pane.element.classList.add('hidden')
}
