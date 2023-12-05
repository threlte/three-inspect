import { load, save } from 'trzy'
import { createPane } from '../pane'
import { dispatcher } from '../lib/event-dispatcher'

// eslint-disable-next-line max-len
const mouseSvg = '<svg viewBox="0 0 24 24"><path d="M4.9 4.9 17.2 10l-4.9 1.7a.9.9 0 0 0-.6.6L10 17.2zm8.2 9.6 5.3 5.3a.9.9 0 1 0 1.4-1.4l-5.3-5.3 5.9-2a1 1 0 0 0 0-1.9l-17-7a1 1 0 0 0-1.3 1.3l7 17a1 1 0 0 0 1.9-.1z"/></svg>'

export const createNav = (controls: HTMLElement, nav: HTMLElement) => {
  let selected = ''

  const selectPane = (title: string) => {
    if (selected === title) {
      return
    }

    save('three-inspect.selectedPane', title)

    controls.querySelector(`[data-pane="${selected}"]`)?.classList.add('hidden')
    const current = nav.querySelector(`[data-nav="${selected}"]`)
    current?.classList.remove('bg-zinc-400', 'text-zinc-800')
    current?.classList.add('text-zinc-400')

    controls.querySelector(`[data-pane="${title}"]`)?.classList.remove('hidden')
    const next = nav.querySelector(`[data-nav="${title}"]`)
    next?.classList.add('bg-zinc-400', 'text-zinc-800')
    next?.classList.remove('text-zinc-400')

    selected = title
  }

  const createNavButton = (title: string) => {
    const button = document.createElement('button')
    button.className = 'py-1.5 px-2 text-zinc-400'
    button.dataset.nav = title
    button.textContent = title
    button.addEventListener('click', () => selectPane(title), { passive: true })
    nav.append(button)
  }

  const addPane = (title: string) => {
    const container = document.createElement('section')
    container.className = 'h-screen flex flex-col overflow-x-hidden overflow-y-auto hidden'
    container.dataset.pane = title
    controls.insertBefore(container, controls.children[controls.children.length - 2])
    createNavButton(title)
    return createPane(container)
  }

  const inspectButton = document.createElement('button')
  inspectButton.title = 'Select an element to inspect it'
  inspectButton.innerHTML = mouseSvg
  inspectButton.className = 'w-6 fill-zinc-400 p-1 hover:fill-zinc-300 hover:bg-[rgba(255,255,255,0.05)]'
  inspectButton.addEventListener('click', () => {
    const enabled = inspectButton.classList.toggle('enabled')
    inspectButton.classList.toggle('bg-zinc-600', enabled)
    inspectButton.classList.toggle('hover:bg-zinc-600', enabled)
    inspectButton.classList.toggle('fill-zinc-100', enabled)
    inspectButton.classList.toggle('hover:fill-zinc-100', enabled)
    dispatcher.dispatchEvent({ enabled, type: 'enable-select' })
  }, { passive: true })
  nav.append(inspectButton)

  createNavButton('World')
  selectPane(load<string>('three-inspect.selectedPane') ?? 'World')

  return { addPane }
}
