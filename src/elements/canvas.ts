import { Container } from '../treeview/container'

export const createCanvas = (renderer: THREE.WebGLRenderer) => {
  const canvas = new Container()
  canvas.resizable = 'right'
  canvas.resizeMax = Infinity
  canvas.dom.classList.add('relative', 'h-screen', 'float-left')
  canvas.dom.style.width = `${(window.innerWidth * 2) / 3}px`

  renderer.domElement.setAttribute('style', `
    width: 100% !important;
    height: 100% !important;
  `)
  canvas.dom.append(renderer.domElement)

  return canvas
}
