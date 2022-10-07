import * as EssentialsPlugin from '@tweakpane/plugin-essentials'
import * as RotationPlugin from '@0b5vr/tweakpane-plugin-rotation'
import * as Tweakpane from 'tweakpane'
import { addPanelEntry, navigate, selectPanel } from './nav'
import { container, resizer, top } from './elements'
import { closeFolders } from './folders'
import css from './index.css?inline'
import { resizable } from './resizable'
import { storage } from '../lib/storage'

const style = document.createElement('style')
style.innerHTML = css
document.head.append(style)

export type Pane = Tweakpane.Pane | Tweakpane.FolderApi

let isVisible = true

const selectedPane = storage.get('selectedPane')

export let pane: Pane

export const state = {
  controlling: false,
}

export const addPane = (title: string) => {
  const newPane = new Tweakpane.Pane({ container: top })
  newPane.registerPlugin(EssentialsPlugin)
  newPane.registerPlugin(RotationPlugin)

  addPanelEntry(title, newPane)

  if (selectedPane === title) {
    selectPanel(title)
  }

  return newPane
}

const setUncontrolled = () => {
  state.controlling = false
}

const setControlled = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  state.controlling = true
  target.addEventListener('mouseup', setUncontrolled, { once: true, passive: true })
}

export const initPane = (renderer: THREE.WebGLRenderer) => {
  document.body.append(container)
  pane = addPane('World')
  pane.element.addEventListener('mousedown', setControlled, { passive: true })

  const disposeResize = resizable(container, resizer, renderer, 300)

  return () => {
    pane.element.removeEventListener('mousedown', setControlled)
    pane.dispose()
    container.remove()
    disposeResize()
  }
}

if (selectedPane === null) {
  selectPanel('World')
}

document.addEventListener('keypress', (event) => {
  if (!event.shiftKey) {
    return
  }

  switch (event.key.toLowerCase()) {
  case 'a':
    container.classList.toggle('visible', !isVisible)
    isVisible = !isVisible
    return

  case 'x':
    closeFolders()
    return

  case '~':
    navigate(-1)
    return

  case '!':
    navigate(+1)
  }
})
