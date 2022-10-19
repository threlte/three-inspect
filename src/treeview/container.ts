/* eslint-disable no-underscore-dangle */
import * as pcuiClass from './class'
import { Element } from './element'

const RESIZE_HANDLE_SIZE = 4

const CLASS_RESIZING = `${pcuiClass.RESIZABLE}-resizing`
const CLASS_RESIZABLE_HANDLE = 'pcui-resizable-handle'
const CLASS_CONTAINER = 'pcui-container'

const CLASS_DRAGGED = `${CLASS_CONTAINER}-dragged`
const CLASS_DRAGGED_CHILD = `${CLASS_DRAGGED}-child`

/**
 * @event
 * @name Container#append
 * @description Fired when a child Element gets added to the Container
 * @param {Element} element - The element that was added
 */

/**
 * @event
 * @name Container#remove
 * @description Fired when a child Element gets removed from the Container
 * @param {Element} element - The element that was removed
 */

/**
 * @event
 * @name Container#scroll
 * @description Fired when the container is scrolled.
 * @param {Event} evt - The native scroll event.
 */

/**
 * @event
 * @name Container#resize
 * @description Fired when the container gets resized using the resize handle.
 */

interface Args {
  flex?: boolean
  grid?: boolean
  resizable?: 'top' | 'right' | 'bottom' | 'left' | null
  resizeMin?: number
  resizeMax?: number
}

/**
 * A container is the basic building block for Elements that are grouped together.
 * A container can contain any other element including other containers.
 * @augments Element
 */
export class Container extends Element {
  resizeMin = 100
  resizeMax = 300

  #scrollable = false
  #resizable: 'top' | 'right' | 'bottom' | 'left' | null = null
  #resizeHorizontally = false
  #draggedStartIndex = -1
  #domResizeHandle: HTMLElement | null = null
  #resizeData: null | {
    x: number
    y: number
    width: number
    height: number
  } = null

  /**
   * Creates a new Container.
   *
   * @param {object} args - Extends the pcui.Element constructor arguments. All settable properties can also be set through the constructor.
   * @param {HTMLElement} [args.dom] - The DOM element to use for the container. If unspecified a new element will be created.
   */
  constructor (args: Args = {}) {
    // @ts-expect-error @TODO fix
    super(args)

    this.dom.classList.add(CLASS_CONTAINER)

    if (args.flex) {
      this.dom.classList.add('flex', 'flex-col')
    } else if (args.grid) {
      this.dom.classList.add('grid')
    }

    this.resizable = args.resizable ?? null
  }

  /**
   * @name Container#append
   * @description Appends an element to the container.
   * @param {Element} element - The element to append.
   * @fires 'append'
   */
  append (element: Element) {
    this.dom.append(element.dom)
    this._onAppendChild(element)
  }

  /**
   * @name Container#appendBefore
   * @description Appends an element to the container before the specified reference element.
   * @param element - The element to append.
   * @param referenceElement - The element before which the element will be appended.
   * @fires 'append'
   */
  appendBefore (element: Element, referenceElement?: Element) {
    this.dom.append(element.dom)
    const referenceDom = referenceElement?.dom as Node

    this.dom.insertBefore(element.dom, referenceDom)

    this._onAppendChild(element)
  }

  /**
   * @name Container#appendAfter
   * @description Appends an element to the container just after the specified reference element.
   * @param element - The element to append.
   * @param referenceElement - The element after which the element will be appended.
   * @fires 'append'
   */
  appendAfter (element: Element, referenceElement?: Element) {
    const referenceDom = referenceElement?.dom

    const elementBefore = referenceDom ? referenceDom.nextSibling : null
    if (elementBefore) {
      this.dom.insertBefore(element.dom, elementBefore)
    } else {
      this.dom.appendChild(element.dom)
    }

    this._onAppendChild(element)
  }

  /**
   * @name Container#prepend
   * @description Inserts an element in the beginning of the container.
   * @param {Element} element - The element to prepend.
   * @fires 'append'
   */
  prepend (element: Element) {
    this.dom.prepend(element.dom)
    this._onAppendChild(element)
  }

  /**
   * @name Container#remove
   * @description Removes the specified child element from the container.
   * @param {Element} element - The element to remove.
   * @fires 'remove'
   */
  remove (element: Element) {
    if (element.parent !== this) {
      return
    }

    this.dom.removeChild(element.dom)

    this._onRemoveChild(element)
  }

  /**
   * @name Container#move
   * @description Moves the specified child at the specified index.
   * @param {Element} element - The element to move.
   * @param {number} index - The index
   */
  move (element: Element, index: number) {
    let idx = -1
    for (let i = 0, l = this.dom.childNodes.length; i < l; i += 1) {
      if (this.dom.childNodes[i].ui === element) {
        idx = i
        break
      }
    }

    if (idx === -1) {
      this.appendBefore(element, this.dom.childNodes[index])
    } else if (index !== idx) {
      this.remove(element)
      if (index < idx) {
        this.appendBefore(element, this.dom.childNodes[index])
      } else {
        this.appendAfter(element, this.dom.childNodes[index - 1])
      }
    }
  }

  /**
   * @name Container#clear
   * @description Clears all children from the container.
   * @fires 'remove' for each child element.
   */
  clear () {
    const { childNodes } = this.dom
    let i = childNodes.length - 1

    while (i > -1) {
      const node = this.dom.childNodes[i]
      if (node.ui && node.ui !== this) {
        node.ui.destroy()
      }

      i -= 1
    }

    if (this.#domResizeHandle !== null) {
      this.#domResizeHandle.removeEventListener('mousedown', this._onResizeStart)
      this.#domResizeHandle = null
    }

    this.dom.innerHTML = ''

    if (this.resizable) {
      this._createResizeHandle()
      this.dom.appendChild(this.#domResizeHandle)
    }
  }

  _onAppendChild (element: Element) {
    element.parent = this
    this.emit('append', element)
  }

  _onRemoveChild (element: Element) {
    element.parent = null
    this.emit('remove', element)
  }

  _onScroll = (evt: Event) => {
    this.emit('scroll', evt)
  }

  _createResizeHandle () {
    const handle = document.createElement('div')
    handle.classList.add(CLASS_RESIZABLE_HANDLE)
    handle.ui = this

    handle.addEventListener('mousedown', this._onResizeStart)

    this.#domResizeHandle = handle
  }

  _onResizeStart = (evt: MouseEvent) => {
    evt.preventDefault()
    evt.stopPropagation()

    window.addEventListener('mousemove', this._onResizeMove)
    window.addEventListener('mouseup', this._onResizeEnd)

    this.#resizeStart()
  }

  _onResizeMove = (evt: MouseEvent) => {
    evt.preventDefault()
    evt.stopPropagation()

    this.#resizeMove(evt.clientX, evt.clientY)
  }

  _onResizeEnd = (evt: MouseEvent) => {
    evt.preventDefault()
    evt.stopPropagation()

    window.removeEventListener('mousemove', this._onResizeMove)
    window.removeEventListener('mouseup', this._onResizeEnd)

    this.#resizeEnd()
  }

  #resizeStart () {
    this.dom.classList.add(CLASS_RESIZING)
  }

  #resizeMove (x: number, y: number) {
    // If we haven't initialized resizeData do so now
    if (!this.#resizeData) {
      this.#resizeData = {
        height: this.dom.clientHeight,
        width: this.dom.clientWidth,
        x,
        y,
      }

      return
    }

    if (this.#resizeHorizontally) {
      // Horizontal resizing
      let offsetX = this.#resizeData.x - x

      if (this.#resizable === 'right') {
        offsetX = -offsetX
      }

      this.width = RESIZE_HANDLE_SIZE + Math.max(this.resizeMin, Math.min(this.resizeMax, (this.#resizeData.width + offsetX)))
    } else {
      // Vertical resizing
      let offsetY = this.#resizeData.y - y

      if (this.#resizable === 'bottom') {
        offsetY = -offsetY
      }

      this.height = Math.max(this.resizeMin, Math.min(this.resizeMax, (this.#resizeData.height + offsetY)))
    }

    this.emit('resize')
  }

  #resizeEnd () {
    this.#resizeData = null
    this.dom.classList.remove(CLASS_RESIZING)
  }

  /**
   * Resize the container
   *
   * @param x - The amount of pixels to resize the width
   * @param y - The amount of pixels to resize the height
   */
  resize (x = 0, y = 0) {
    this.#resizeStart()
    this.#resizeMove(0, 0)
    this.#resizeMove(-x + RESIZE_HANDLE_SIZE, -y)
    this.#resizeEnd()
  }

  #getDraggedChildIndex (draggedChild: Element) {
    const { childNodes } = this.dom
    for (let i = 0, l = childNodes.length; i < l; i += 1) {
      if (childNodes[i].ui === draggedChild) {
        return i
      }
    }

    return -1
  }

  _onChildDragStart (evt: Event, childPanel: Element) {
    this.dom.classList.add(CLASS_DRAGGED_CHILD)

    this.#draggedStartIndex = this.#getDraggedChildIndex(childPanel)

    childPanel.dom.classList.add(CLASS_DRAGGED)

    this.emit('child:dragstart', childPanel, this.#draggedStartIndex)
  }

  _onChildDragMove (evt: MouseEvent, childPanel: Element) {
    const rect = this.dom.getBoundingClientRect()

    const dragOut = (evt.clientX < rect.left || evt.clientX > rect.right || evt.clientY < rect.top || evt.clientY > rect.bottom)

    const childPanelIndex = this.#getDraggedChildIndex(childPanel)

    if (dragOut) {
      childPanel.dom.classList.remove(CLASS_DRAGGED)
      if (this.#draggedStartIndex !== childPanelIndex) {
        this.remove(childPanel)
        if (this.#draggedStartIndex < childPanelIndex) {
          this.appendBefore(childPanel, this.dom.childNodes[this.#draggedStartIndex])
        } else {
          this.appendAfter(childPanel, this.dom.childNodes[this.#draggedStartIndex - 1])
        }
      }

      return
    }

    childPanel.dom.classList.add(CLASS_DRAGGED)

    const y = evt.clientY - rect.top
    let ind = null

    // Hovered script
    const { childNodes } = this.dom
    for (let i = 0, l = childNodes.length; i < l; i += 1) {
      const otherPanel = childNodes[i].ui
      const otherTop = otherPanel.dom.offsetTop
      if (i < childPanelIndex) {
        if (y <= otherTop + otherPanel.header.height) {
          ind = i
          break
        }
      } else if (i > childPanelIndex) {
        if (y + childPanel.height >= otherTop + otherPanel.height) {
          ind = i
          break
        }
      }
    }

    if (ind !== null && childPanelIndex !== ind) {
      this.remove(childPanel)
      if (ind < childPanelIndex) {
        this.appendBefore(childPanel, childNodes[ind])
      } else {
        this.appendAfter(childPanel, childNodes[ind - 1])
      }
    }
  }

  _onChildDragEnd (evt: Event, childPanel: Element) {
    this.dom.classList.remove(CLASS_DRAGGED_CHILD)

    childPanel.dom.classList.remove(CLASS_DRAGGED)

    const index = this.#getDraggedChildIndex(childPanel)

    this.emit('child:dragend', childPanel, index, this.#draggedStartIndex)

    this.#draggedStartIndex = -1
  }

  forEachChild (fn) {
    for (let i = 0; i < this.dom.childNodes.length; i += 1) {
      const node = this.dom.childNodes[i].ui
      if (node) {
        const result = fn(node, i)
        if (result === false) {
          // Early out
          break
        }
      }
    }
  }

  override destroy () {
    if (this.destroyed) {
      return
    }

    if (this.#domResizeHandle !== null) {
      this.#domResizeHandle.removeEventListener('mousedown', this._onResizeStart)
      window.removeEventListener('mousemove', this._onResizeMove)
      window.removeEventListener('mouseup', this._onResizeEnd)
    }

    this.#domResizeHandle = null

    super.destroy()
  }

  set scrollable (value) {
    if (this.#scrollable === value) {
      return
    }

    this.#scrollable = value

    if (value) {
      this.dom.classList.add('overflow-auto')
    } else {
      this.dom.classList.remove('overflow-auto')
    }
  }

  get scrollable () {
    return this.#scrollable
  }

  set resizable (value: 'top' | 'right' | 'bottom' | 'left' | null) {
    if (value === this.#resizable) {
      return
    }

    // Remove old class
    if (this.#resizable) {
      this.dom.classList.remove(`${pcuiClass.RESIZABLE}-${this.#resizable}`)
    }

    this.#resizable = value
    this.#resizeHorizontally = (value === 'right' || value === 'left')

    if (value) {
      // Add resize class and create / append resize handle
      this.dom.classList.add(pcuiClass.RESIZABLE, `${pcuiClass.RESIZABLE}-${value}`)

      if (this.#domResizeHandle === null) {
        this._createResizeHandle()
      }
      this.dom.appendChild(this.#domResizeHandle!)
    } else {
      // Remove resize class and resize handle
      this.dom.classList.remove(pcuiClass.RESIZABLE)
      if (this.#domResizeHandle !== null) {
        this.dom.removeChild(this.#domResizeHandle)
      }
    }
  }

  get resizable () {
    return this.#resizable
  }
}
