type Sides = 'top' | 'right' | 'bottom' | 'left'

const RESIZE_HANDLE_SIZE = 3

interface Args {
  element: HTMLElement
  side: Sides
  min?: number
  max?: number
  height?: number
  width?: number
}

const getPosition = (side: Sides) => {
  switch (side) {
  case 'left': return 'left: 0;'
  case 'right': return 'left: calc(100% - 3px);'
  case 'top': return 'top: 0;'
  case 'bottom': return 'bottom: 0;'
  default: return ''
  }
}

export const resizable = (args: Args) => {
  const {
    element,
    side,
    min = 100,
    max = 300,
  } = args

  let x = 0
  let y = 0
  let width = 0
  let height = 0

  const horizontal = (side === 'right' || side === 'left')
  const dom = document.createElement('div')
  const handle = document.createElement('div')
  handle.style.cssText = `
    position: absolute;
    z-index: 1000;
    opacity: 0.5;
    background-color: var(--color-resize-handle, #888);
    cursor: ${horizontal ? 'ew' : 'ns'}-resize;
    ${horizontal ? 'width' : 'height'}: 3px;
    ${horizontal ? 'height' : 'width'}: 100%;
    ${horizontal ? 'top: 0; bottom: 0;' : 'left: 0; right: 0;'}
    ${getPosition(side)}
  `

  const onResizeMove = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (horizontal) {
      let offsetX = x - event.clientX

      if (side === 'right') {
        offsetX = -offsetX
      }

      const w = RESIZE_HANDLE_SIZE + Math.max(min, Math.min(max, (width + offsetX)))
      dom.style.width = `${w}px`
    } else {
      let offsetY = y - event.clientY

      if (side === 'bottom') {
        offsetY = -offsetY
      }

      const h = Math.max(min, Math.min(max, (height + offsetY)))
      dom.style.height = `${h}px`
    }
  }

  const onResizeEnd = (evt: MouseEvent) => {
    evt.preventDefault()
    evt.stopPropagation()

    window.removeEventListener('mousemove', onResizeMove)
    window.removeEventListener('mouseup', onResizeEnd)

    handle.style.opacity = '0.5'
  }

  const onResizeStart = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    x = event.clientX
    y = event.clientY
    width = dom.clientWidth
    height = dom.clientHeight

    window.addEventListener('mousemove', onResizeMove)
    window.addEventListener('mouseup', onResizeEnd)

    handle.style.opacity = '1'
  }

  handle.addEventListener('mousedown', onResizeStart)

  dom.style.position = 'relative'
  dom.style.overflow = 'hidden'

  dom.append(element)
  dom.append(handle)

  if (args.height) {
    dom.style.height = `${args.height}px`
  }

  if (args.width) {
    dom.style.width = `${args.width}px`
  }

  return dom
}
