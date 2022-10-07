export const resizable = (
  element: HTMLElement,
  resizer: HTMLElement,
  renderer: THREE.WebGLRenderer,
  minSize = 20
) => {
  let startWidth = 0
  let startX = 0
  let startMouseX = 0

  const handleMove = (event: MouseEvent) => {
    const width = startWidth - (event.pageX - startMouseX)

    if (width >= minSize) {
      element.style.width = `${width}px`
      element.style.left = `${startX + (event.pageX - startMouseX)}px`
    } else {
      renderer.domElement.style.removeProperty('width')
      element.style.removeProperty('width')
      element.style.removeProperty('left')
    }
  }

  const stopResize = () => {
    window.removeEventListener('mousemove', handleMove)
  }

  const handleMouseDown = (event: MouseEvent) => {
    event.preventDefault()

    const rect = element.getBoundingClientRect()
    startWidth = rect.width
    startX = rect.left
    startMouseX = event.pageX

    window.addEventListener('mousemove', handleMove, { passive: true })
    window.addEventListener('mouseup', stopResize, { once: true, passive: true })
  }

  resizer.addEventListener('mousedown', handleMouseDown)

  return () => {
    resizer.removeEventListener('mousedown', handleMouseDown)
  }
}
