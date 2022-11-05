import { createPane } from '../pane'
import { storage } from '../lib/storage'

export const createNav = (controls: HTMLElement, nav: HTMLElement) => {
  let selected = ''

  const selectPane = (title: string) => {
    if (selected === title) {
      return
    }

    storage.set('selectedPane', title)

    controls.querySelector(`[data-pane="${selected}"]`)?.classList.add('hidden')
    nav.querySelector(`[data-nav="${selected}"]`)?.classList.remove('selected')

    controls.querySelector(`[data-pane="${title}"]`)?.classList.remove('hidden')
    nav.querySelector(`[data-nav="${title}"]`)?.classList.add('selected')

    selected = title
  }

  const createNavButton = (title: string) => {
    const button = document.createElement('button')
    button.className = 'tp-fldv_b nav-button'
    button.dataset.nav = title
    button.textContent = title
    button.addEventListener('click', () => selectPane(title), { passive: true })
    nav.append(button)
  }

  createNavButton('World')
  selectPane('World')

  const addPane = (title: string) => {
    const container = document.createElement('section')
    container.className = 'h-screen flex flex-col overflow-x-hidden overflow-y-auto hidden'
    container.dataset.pane = title
    controls.insertBefore(container, controls.children[controls.children.length - 2])
    createNavButton(title)
    return createPane(container)
  }

  return { addPane }
}
