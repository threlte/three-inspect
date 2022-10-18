/* eslint-disable no-underscore-dangle */
import * as pcuiClass from './class'
import type { EventHandle } from './event-handle'
import { Events } from './events'

/**
 * @event
 * @name Element#enable
 * @description Fired when the Element gets enabled
 */

/**
 * @event
 * @name Element#disable
 * @description Fired when the Element gets disabled
 */

/**
 * @event
 * @name Element#hide
 * @description Fired when the Element gets hidden
 */

/**
 * @event
 * @name Element#hideToRoot
 * @description Fired when the Element or any of its parent get hidden
 */

/**
 * @event
 * @name Element#show
 * @description Fired when the Element stops being hidden
 */

/**
 * @event
 * @name Element#showToRoot
 * @description Fired when the Element and all of its parents become visible
 */

/**
 * @event
 * @name Element#readOnly
 * @param {boolean} readOnly - Whether the Element is now read only
 * @description Fired when the readOnly property of an Element changes
 */

/**
 * @event
 * @name Element#parent
 * @description Fired when the Element's parent gets set
 * @param {Element} parent - The new parent
 */

/**
 * @event
 * @name Element#click
 * @description Fired when the mouse is clicked on the Element but only if the Element is enabled.
 * @param {Event} evt - The native mouse event.
 */

/**
 * @event
 * @name Element#hover
 * @description Fired when the mouse starts hovering on the Element
 * @param {Event} evt - The native mouse event.
 */

/**
 * @event
 * @name Element#hoverend
 * @description Fired when the mouse stops hovering on the Element
 * @param {Event} evt - The native mouse event.
 */

/**
 * @event
 * @name Element#destroy
 * @description Fired after the element has been destroyed.
 * @param {HTMLElement} dom - The DOM element
 * @param {Element} element - The element
 */

/**
 * @event
 * @name Element#hoverend
 * @description Fired when the mouse stops hovering on the Element
 * @param {Event} evt - The native mouse event.
 */

interface Args {
  dom?: HTMLElement
  id?: string
  class?: string[]
  enabled?: boolean
  isRoot?: boolean
  hidden?: boolean
}

/**
 * @name Element
 * @class
 * @classdesc The base class for all UI elements.
 * @augments Events
 * @property {boolean} hidden Gets / sets whether the Element is hidden.
 * @property {boolean} hiddenToRoot Gets whether the Element is hidden all the way up to the root.
 * If the Element itself or any of its parents are hidden then this is true.
 * @property {boolean} ignoreParent Gets / sets whether the Element will ignore parent events & variable states.
 * @property {number} [width=null] Gets / sets the width of the Element in pixels. Can also be an empty string to remove it.
 * @property {number} [height=null] Gets / sets the height of the Element in pixels. Can also be an empty string to remove it.
 * @property {boolean} error Gets / sets whether the Element is in an error state.
 * @property {BindingBase} binding Gets / sets the Binding object for the element.
 */
export class Element extends Events {
  destroyed = false
  #enabled = true
  #ignoreParent = false
  #parent: Element | null = null
  #flashTimeout = -1
  #hiddenParents = false
  #hidden = false
  #readOnly = false
  #eventsParent: EventHandle[] = []

  /**
   * The root DOM node for this Element.
   */
  dom: HTMLElement

  /**
   * Creates a new Element.
   *
   * @param {object} args - The arguments. All settable properties can also be set through the constructor.
   * @param {object} [args.dom] - The DOM element that this pcui.Element wraps.
   * @param {string} [args.id] - The desired id for the Element HTML node.
   * @param {string[]} [args.class] - The CSS class or classes we want to add to the element.
   * @param {boolean} [args.isRoot] - If true then this is the root element. Set this to true for the topmost Element in your page.
   */
  constructor (args: Args = {}) {
    super()

    this.dom = args.dom ?? document.createElement('div')

    if (args.id !== undefined) {
      this.dom.id = args.id
    }

    // Add ui reference
    this.dom.ui = this

    this.dom.classList.add('pcui-element')

    // Add user classes
    if (args.class) {
      for (let i = 0; i < args.class.length; i += 1) {
        this.dom.classList.add(args.class[i])
      }
    }

    this.#hiddenParents = !args.isRoot
    this.enabled = args.enabled ?? true
    this.hidden = args.hidden ?? false
  }

  /**
   * @name Element#link
   * @description Links the specified observers and paths to the Element's data binding.
   * @param {Observer|Observer[]} observers - An array of observers or a single observer.
   * @param paths - A path for the observer(s) or an array of paths that maps to each separate observer.
   */
  link (observers, paths: string | string[]) {
    if (this._binding) {
      this._binding.link(observers, paths)
    }
  }


  /**
   * @name Element#unlink
   * @description Unlinks the Element from its observers
   */
  unlink () {
    if (this._binding) {
      this._binding.unlink()
    }
  }

  /**
   * @name Element#flash
   * @description Triggers a flash animation on the Element.
   */
  flash () {
    if (this.#flashTimeout > -1) {
      return
    }

    this.dom.classList.add(pcuiClass.FLASH)
    this.#flashTimeout = setTimeout(() => {
      this.#flashTimeout = -1
      this.dom.classList.remove(pcuiClass.FLASH)
    }, 200)
  }

  #onHiddenToRootChange (hiddenToRoot: boolean) {
    if (hiddenToRoot) {
      this.emit('hideToRoot')
    } else {
      this.emit('showToRoot')
    }
  }

  #onEnabledChange (enabled: boolean) {
    if (enabled) {
      this.dom.classList.remove(pcuiClass.DISABLED)
    } else {
      this.dom.classList.add(pcuiClass.DISABLED)
    }

    this.emit(enabled ? 'enable' : 'disable')
  }

  #onParentDestroy = () => {
    this.destroy()
  }

  #onParentDisable = () => {
    if (this.#ignoreParent) {
      return
    }
    if (this.#enabled) {
      this.#onEnabledChange(false)
    }
  }

  #onParentEnable = () => {
    if (this.#ignoreParent) {
      return
    }
    if (this.#enabled) {
      this.#onEnabledChange(true)
    }
  }

  #onParentShowToRoot = () => {
    const oldHiddenToRoot = this.hiddenToRoot
    this.#hiddenParents = false
    if (oldHiddenToRoot !== this.hiddenToRoot) {
      this.#onHiddenToRootChange(this.hiddenToRoot)
    }
  }

  #onParentHideToRoot = () => {
    const oldHiddenToRoot = this.hiddenToRoot
    this.#hiddenParents = true
    if (oldHiddenToRoot !== this.hiddenToRoot) {
      this.#onHiddenToRootChange(this.hiddenToRoot)
    }
  }

  #onReadOnlyChange (readOnly: boolean) {
    if (readOnly) {
      this.dom.classList.add(pcuiClass.READONLY)
    } else {
      this.dom.classList.remove(pcuiClass.READONLY)
    }

    this.emit('readOnly', readOnly)
  }

  #onParentReadOnlyChange = (readOnly: boolean) => {
    if (this.#ignoreParent) {
      return
    }

    if (readOnly) {
      if (!this.#readOnly) {
        this.#onReadOnlyChange(true)
      }
    } else if (!this.#readOnly) {
      this.#onReadOnlyChange(false)
    }
  }

  /**
   * Destroys the Element and its events.
   */
  destroy () {
    if (this.destroyed) {
      return
    }

    this.destroyed = true

    if (this.binding) {
      this.binding = null
    } else {
      this.unlink()
    }

    if (this.parent) {
      const parent = this.parent

      for (let i = 0; i < this.#eventsParent.length; i += 1) {
        this.#eventsParent[i].unbind()
      }
      this.#eventsParent.length = 0


      /*
       * Remove element from parent
       * Check if parent has been destroyed already
       * Because we do not want to be emitting events
       * On a destroyed parent after it's been destroyed
       * As it is easy to lead to null exceptions
       */
      if (parent.remove && !parent.destroyed) {
        parent.remove(this)
      }

      /*
       * Set parent to null and remove from
       * parent dom just in case parent.remove above
       * didn't work because of an override or other condition
       */
      this.#parent = null

      /*
       * Do not manually call removeChild for elements whose parent has already been destroyed.
       * For example when we destroy a TreeViewItem that has many child nodes,
       * that will trigger every child Element to call dom.parentElement.removeChild(dom).
       * But we don't need to remove all these DOM elements from their parents since the root DOM element is destroyed anyway.
       * This has a big impact on destroy speed in certain cases.
       */
      if (!parent.destroyed && this.dom && this.dom.parentElement) {
        this.dom.parentElement.removeChild(this.dom)
      }
    }

    const { dom } = this

    if (dom) {
      // Remove ui reference
      delete dom.ui

      this.dom = null
    }

    if (this.#flashTimeout > -1) {
      clearTimeout(this.#flashTimeout)
    }

    this.emit('destroy', dom, this)

    this.unbind()
  }

  /**
   * Whether the Element or its parent chain is enabled or not.
   * @default true
   */
  set enabled (value: boolean) {
    if (this.#enabled === value) {
      return
    }

    // Remember if enabled in hierarchy
    const { enabled } = this

    this.#enabled = value

    // Only fire event if hierarchy state changed
    if (enabled !== value) {
      this.#onEnabledChange(value)
    }
  }

  get enabled (): boolean {
    if (this.#ignoreParent) {
      return this.#enabled
    }
    return this.#enabled && (!this.#parent || this.#parent.enabled)
  }

  set ignoreParent (value) {
    this.#ignoreParent = value
    this.#onEnabledChange(this.enabled)
    this.#onReadOnlyChange(this.readOnly)
  }

  get ignoreParent () {
    return this.#ignoreParent
  }

  /**
   * The parent Element.
   */
  set parent (value) {
    if (value === this.#parent) {
      return
    }

    const oldEnabled = this.enabled
    const oldReadonly = this.readOnly
    const oldHiddenToRoot = this.hiddenToRoot

    if (this.#parent) {
      for (let i = 0; i < this.#eventsParent.length; i += 1) {
        this.#eventsParent[i].unbind()
      }
      this.#eventsParent.length = 0
    }

    this.#parent = value

    if (this.#parent) {
      this.#eventsParent.push(this.#parent.once('destroy', this.#onParentDestroy))
      this.#eventsParent.push(this.#parent.on('disable', this.#onParentDisable))
      this.#eventsParent.push(this.#parent.on('enable', this.#onParentEnable))
      this.#eventsParent.push(this.#parent.on('readOnly', this.#onParentReadOnlyChange))
      this.#eventsParent.push(this.#parent.on('showToRoot', this.#onParentShowToRoot))
      this.#eventsParent.push(this.#parent.on('hideToRoot', this.#onParentHideToRoot))

      this.#hiddenParents = this.#parent.hiddenToRoot
    } else {
      this.#hiddenParents = true
    }

    this.emit('parent', this.#parent)

    const newEnabled = this.enabled
    if (newEnabled !== oldEnabled) {
      this.#onEnabledChange(newEnabled)
    }

    const newReadonly = this.readOnly
    if (newReadonly !== oldReadonly) {
      this.#onReadOnlyChange(newReadonly)
    }

    const hiddenToRoot = this.hiddenToRoot
    if (hiddenToRoot !== oldHiddenToRoot) {
      this.#onHiddenToRootChange(hiddenToRoot)
    }
  }

  get parent () {
    return this.#parent
  }

  set hidden (value: boolean) {
    if (value === this.#hidden) {
      return
    }

    const oldHiddenToRoot = this.hiddenToRoot

    this.#hidden = value

    if (value) {
      this.dom.classList.add(pcuiClass.HIDDEN)
    } else {
      this.dom.classList.remove(pcuiClass.HIDDEN)
    }

    this.emit(value ? 'hide' : 'show')

    if (this.hiddenToRoot !== oldHiddenToRoot) {
      this.#onHiddenToRootChange(this.hiddenToRoot)
    }
  }

  get hidden (): boolean {
    return this.#hidden
  }

  get hiddenToRoot (): boolean {
    return this.#hidden || this.#hiddenParents
  }

  /**
   * Whether the Element is read only.
   */
  set readOnly (value: boolean) {
    if (this.#readOnly === value) {
      return
    }
    this.#readOnly = value

    this.#onReadOnlyChange(value)
  }

  get readOnly (): boolean {
    if (this.#ignoreParent) {
      return this.#readOnly
    }
    return this.#readOnly || Boolean(this.#parent && this.#parent.readOnly)
  }

  set error (value: boolean) {
    if (this._hasError === value) {
      return
    }
    this._hasError = value
    if (value) {
      this.dom.classList.add(pcuiClass.ERROR)
    } else {
      this.dom.classList.remove(pcuiClass.ERROR)
    }
  }

  get error () {
    return this._hasError
  }

  set width (value: number) {
    this.dom.style.width = `${value}px`
  }

  get width (): number {
    return this.dom.clientWidth
  }

  set height (value: number) {
    this.dom.style.height = `${value}px`
  }

  get height (): number {
    return this.dom.clientHeight
  }

  set binding (value) {
    if (this._binding === value) {
      return
    }

    let prevObservers
    let prevPaths

    if (this._binding) {
      prevObservers = this._binding.observers
      prevPaths = this._binding.paths

      this.unlink()
      this._binding.dom = null
      this._binding = null
    }

    this._binding = value

    if (this._binding) {
      this._binding.dom = this
      if (prevObservers && prevPaths) {
        this.link(prevObservers, prevPaths)
      }
    }
  }

  get binding () {
    return this._binding
  }
}
