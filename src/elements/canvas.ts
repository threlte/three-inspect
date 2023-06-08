import { refs } from '../refs'
import { resizable } from '../lib/resizable'

export const initCanvas = () => {
  const canvas = refs.renderer.domElement

  canvas.setAttribute('style', `
    width: 100% !important;
    height: 100% !important;
  `)

  const container = resizable({
    element: canvas,
    max: Number.POSITIVE_INFINITY,
    side: 'right',
    width: window.innerWidth - 335,
  })

  container.style.cssText += '--color-resize-handle: #222;'
  container.classList.add('h-screen')

  return container
}
