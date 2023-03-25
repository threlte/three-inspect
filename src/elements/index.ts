import { createControls } from './controls'
import { createNav } from './nav'
import { initCanvas } from './canvas'
import { initScene } from '../scene'
import { initStats } from './stats'
import { refs } from '../refs'

export const initElements = (options: {
  location: 'right' | 'overlay'
}) => {
  const disposers: Disposer[] = []
  const root = document.createElement('div')
  root.className = options.location === 'right'
    ? 'z-[100] absolute top-0 left-0 w-screen h-screen flex'
    : 'z-[100] absolute top-0 right-0 w-[350px] h-screen flex'
  refs.root = root

  if (options.location === 'right') {
    const canvas = initCanvas()
    root.append(canvas)

    let width = window.innerWidth

    const handleResize = () => {
      const newWidth = window.innerWidth
      const delta = newWidth - width
      canvas.style.width = `${canvas.clientWidth + delta}px`
      width = newWidth
    }

    window.addEventListener('resize', handleResize, { passive: true })

    disposers.push(() => window.removeEventListener('resize', handleResize))
  }

  const { controls, nav, treeroot, treeview, pane } = createControls()
  const { addPane } = createNav(controls, nav)

  disposers.push(initStats(controls))
  disposers.push(initScene(treeview, treeroot, pane))

  root.append(controls)
  document.body.append(root)

  return { addPane, disposers }
}
