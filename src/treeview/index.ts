/* eslint-disable max-depth */
/* eslint-disable no-underscore-dangle */
import { Container } from './container'
import { Element } from './element'
import { TreeViewItem } from './item'
import { searchItems } from './search'

const CLASS_ROOT = 'pcui-treeview'
const CLASS_DRAGGED_ITEM = `${CLASS_ROOT}-item-dragged`
const CLASS_DRAGGED_HANDLE = [`${CLASS_ROOT}-drag-handle`, 'border-white', 'border-2']
const CLASS_FILTERING = `${CLASS_ROOT}-filtering`
const CLASS_FILTER_RESULT = `${CLASS_FILTERING}-result`

const DRAG_AREA_INSIDE = 'inside'
const DRAG_AREA_BEFORE = 'before'
const DRAG_AREA_AFTER = 'after'

/**
 * @event
 * @name TreeView#dragstart
 * @param {TreeViewItem[]} items - The dragged items
 * @description Fired when we start dragging a TreeViewItem
 */

/**
 * @event
 * @name TreeView#dragend
 * @description Fired when we stop dragging a TreeViewItem
 */

/**
 * @event
 * @name TreeView#reparent
 * @description Fired when we reparent TreeViewItems
 * @param {object[]} items - An array of items we reparented. Each element contains an object: {item, newParent, newChildIndex, oldParent}.
 */

/**
 * @event
 * @name TreeView#select
 * @description Fired when we select a TreeViewItem
 * @param {TreeViewItem} item - The item
 */

/**
 * @event
 * @name TreeView#deselect
 * @description Fired when we deselect a TreeViewItem
 * @param {TreeViewItem} item - The item
 */

/**
 * @event
 * @name TreeView#rename
 * @description Fired when we rename a TreeViewItem
 * @param {TreeViewItem} item - The item
 * @param {string} name - The new name
 */

/**
 * @classdesc A container that can show a treeview like a hierarchy. The treeview contains
 * pcui.TreeViewItems.
 * @augments Container
 * @property {boolean} isDragging Whether we are currently dragging a TreeViewItem.
 * @property {string} filter Gets / sets a filter that searches TreeViewItems and only shows the ones that are relevant to the filter.
 * @property {TreeViewItem[]} selected Gets the selected TreeViewItems.
 */
export class TreeView extends Container {
  /**
   * Whether reordering TreeViewItems is allowed.
   * @default true
   */
  allowReordering = true

  /**
   * Whether renaming TreeViewItems is allowed by double clicking on them.
   * @default true
   */
  allowRenaming = true

  /**
   * A function to be called when we right click on a TreeViewItem.
   */
  onContextMenu: null | ((event: MouseEvent, item: TreeViewItem) => void) = null

  onReparentFn: null | (() => void) = null

  #allowDrag = true
  #wasDraggingAllowedBeforeFiltering = true
  #selectedItems: TreeViewItem[] = []
  #dragItems: TreeViewItem[] = []
  #dragging = false
  #dragOverItem: TreeViewItem | null = null
  _pressedCtrl = false
  _pressedShift = false
  _dragScroll = 0
  #dragScrollInterval = -1
  _dragArea = DRAG_AREA_INSIDE
  _filter = null
  _filterResults: TreeViewItem[] = []

  _dragHandle: Element
  _dragScrollElement: Element

  /**
   * Creates a new TreeView.
   *
   * @param {object} [args] - The arguments. All properties can be set through the arguments as well.
   * @param {Function} [args.onReparent] - A function to be called when we try to reparent tree items. If a function is provided then the
   * @param {Element} [args.dragScrollElement] - An element (usually a container of the tree view) that will be scrolled when the user
   * drags towards the edges of the treeview. Defaults to the TreeView itself.
   * tree items will not be reparented by the TreeView but instead will rely on the function to reparent them as it sees fit.
   */
  constructor (args: Args = {}) {
    super(args)

    this.dom.classList.add(
      CLASS_ROOT,
      'z-10',
      'bg-default-gray',
      'text-white',
      'min-w-max',
      'font-mono',
      'text-[11px]'
    )

    this._dragHandle = new Element({
      class: [
        ...CLASS_DRAGGED_HANDLE,
        'fixed',
        'w-[32px]',
        'h-[20px]',
        'top-0',
        'z-[4]',
        '-mt-1',
        '-ml-1',
      ],
    })
    this._dragScrollElement = args.dragScrollElement || this
    this.append(this._dragHandle)

    window.addEventListener('keydown', this._updateModifierKeys)
    window.addEventListener('keyup', this._updateModifierKeys)
    window.addEventListener('mousedown', this._updateModifierKeys)

    this.dom.addEventListener('mouseleave', this.#onMouseLeave)

    this._dragHandle.dom.addEventListener('mousemove', this.#onDragMove)
    this._dragHandle.on('destroy', (dom) => {
      dom.removeEventListener('mousemove', this.#onDragMove)
    })
  }

  _updateModifierKeys = (evt) => {
    this._pressedCtrl = evt.ctrlKey || evt.metaKey
    this._pressedShift = evt.shiftKey
  }

  /**
   * Finds the next tree item that is not currently hidden
   *
   * @param currentItem - The current tree item
   * @returns The next tree item.
   */
  #findNextVisibleTreeItem (currentItem: TreeViewItem): TreeViewItem | null {
    if (currentItem.numChildren > 0 && currentItem.open) {
      return currentItem.firstChild
    }

    const { nextSibling } = currentItem
    if (nextSibling) {
      return nextSibling
    }

    let { parent } = currentItem
    if (!(parent instanceof TreeViewItem)) {
      return null
    }

    let parentSibling = parent.nextSibling
    while (!parentSibling) {
      parent = parent.parent
      if (!(parent instanceof TreeViewItem)) {
        break
      }

      parentSibling = parent.nextSibling
    }

    return parentSibling
  }

  /**
   * Finds the last visible child tree item of the specified tree item.
   *
   * @param currentItem - The current item.
   * @returns The last child item.
   */
  _findLastVisibleChildTreeItem (currentItem: TreeViewItem): TreeViewItem | null {
    if (!currentItem.numChildren || !currentItem.open) {
      return null
    }

    let lastChild = currentItem.lastChild
    while (lastChild && lastChild.numChildren && lastChild.open) {
      lastChild = lastChild.lastChild
    }

    return lastChild
  }

  /**
   * Finds the previous visible tree item of the specified tree item.
   *
   * @param currentItem - The current tree item.
   * @returns The previous item.
   */
  _findPreviousVisibleTreeItem (currentItem: TreeViewItem): TreeViewItem | null {
    const sibling = currentItem.previousSibling
    if (sibling) {
      if (sibling.numChildren > 0 && sibling.open) {
        return this._findLastVisibleChildTreeItem(sibling)
      }

      return sibling
    }

    const parent = currentItem.parent
    if (!(parent instanceof TreeViewItem)) {
      return null
    }

    return parent
  }

  /**
   * Gets the visible tree items between the specified start and end tree items.
   *
   * @param startChild - The start tree item.
   * @param endChild - The end tree item.
   * @returns The tree items.
   */
  _getChildrenRange (startChild: TreeViewItem, endChild: TreeViewItem): TreeViewItem[] {
    const result = []

    // Select search results if we are currently filtering tree view items
    if (this._filterResults.length > 0) {
      const filterResults = this.dom.querySelectorAll(`.${CLASS_ROOT}-item.${CLASS_FILTER_RESULT}`)

      let startIndex = -1
      let endIndex = -1

      for (let i = 0; i < filterResults.length; i += 1) {
        const item = filterResults[i].ui

        if (item === startChild) {
          startIndex = i
        } else if (item === endChild) {
          endIndex = i
        }

        if (startIndex !== -1 && endIndex !== -1) {
          const start = (startIndex < endIndex ? startIndex : endIndex)
          const end = (startIndex < endIndex ? endIndex : startIndex)
          for (let j = start; j <= end; j += 1) {
            result.push(filterResults[j].ui)
          }

          break
        }
      }
    } else {
      // If we are not filtering the tree view then find the next visible tree item
      let current: TreeViewItem | null = startChild

      const rectStart = startChild.dom.getBoundingClientRect()
      const rectEnd = endChild.dom.getBoundingClientRect()

      if (rectStart.top < rectEnd.top) {
        while (current && current !== endChild) {
          current = this.#findNextVisibleTreeItem(current)
          if (current && current !== endChild) {
            result.push(current)
          }
        }
      } else {
        while (current && current !== endChild) {
          current = this._findPreviousVisibleTreeItem(current)
          if (current && current !== endChild) {
            result.push(current)
          }
        }
      }

      result.push(endChild)
    }

    return result
  }

  override _onAppendChild (element: TreeViewItem) {
    super._onAppendChild(element)

    if (element instanceof TreeViewItem) {
      this._onAppendTreeViewItem(element)
    }
  }

  override _onRemoveChild (element: TreeViewItem) {
    if (element instanceof TreeViewItem) {
      this._onRemoveTreeViewItem(element)
    }

    super._onRemoveChild(element)
  }

  _onAppendTreeViewItem (element: TreeViewItem) {
    element.treeView = this

    if (this._filter) {
      /*
       * Add new item to filtered results if it
       * satisfies the current filter
       */
      this._searchItems([[element.text, element]], this._filter)
    }

    // Do the same for all children of the element
    element.forEachChild((child) => {
      if (child instanceof TreeViewItem) {
        this._onAppendTreeViewItem(child)
      }
    })
  }

  _onRemoveTreeViewItem (element: TreeViewItem) {
    element.selected = false

    // Do the same for all children of the element
    element.forEachChild((child) => {
      if (child instanceof TreeViewItem) {
        this._onRemoveTreeViewItem(child)
      }
    })
  }

  // Called when a key is down on a child TreeViewItem.
  _onChildKeyDown (evt: KeyboardEvent, element: TreeViewItem) {
    const lowerKey = evt.key.toLowerCase()

    if (!['tab', 'arrowleft ', 'arrowup', 'arrowright', 'arrowdown'].includes(lowerKey)) {
      return
    }

    evt.preventDefault()
    evt.stopPropagation()

    if (lowerKey === 'arrowdown') {
      // Down - select next tree item
      if (this.#selectedItems.length > 0) {
        const next = this.#findNextVisibleTreeItem(element)
        if (next) {
          if (this._pressedShift || this._pressedCtrl) {
            next.selected = true
          } else {
            this._selectSingleItem(next)
          }
        }
      }
    } else if (lowerKey === 'arrowup') {
      // Up - select previous tree item
      if (this.#selectedItems.length > 0) {
        const prev = this._findPreviousVisibleTreeItem(element)
        if (prev) {
          if (this._pressedShift || this._pressedCtrl) {
            prev.selected = true
          } else {
            this._selectSingleItem(prev)
          }
        }
      }
    } else if (lowerKey === 'arrowleft') {
      // Left (close)
      if (element.parent !== this) {
        element.open = false
      }
    } else if (lowerKey === 'arrowright') {
      // Right (open)
      element.open = true
    } else if (lowerKey === 'skip') {
      /*
       * Tab
       * skip
       */
    }
  }

  // Called when we click on a child TreeViewItem
  _onChildClick (event: MouseEvent, element: TreeViewItem) {
    if (event.button !== 0) {
      return
    }

    if (!element.allowSelect) {
      return
    }

    if (this._pressedCtrl) {
      // Toggle selection when Ctrl is pressed
      element.selected = !element.selected
    } else if (this._pressedShift) {
      // On shift add to selection
      if (!this.#selectedItems.length || this.#selectedItems.length === 1 && this.#selectedItems[0] === element) {
        element.selected = true
        return
      }

      const selected = this.#selectedItems[this.#selectedItems.length - 1]
      selected.parentsOpen = true

      const children = this._getChildrenRange(selected, element)
      children.forEach((child) => {
        if (child.allowSelect) {
          child.selected = true
        }
      })
    } else {
      // Deselect other items
      this._selectSingleItem(element)
    }
  }

  /**
   * Call specified function on every child TreeViewItem by traversing the hierarchy depth first.
   *
   * @param fn - The function to call. The function takes the TreeViewItem as an argument.
   */
  traverseDepthFirst (fn: (item: TreeViewItem) => void) {
    const traverse = (item: TreeViewItem | undefined) => {
      if (!item || !(item instanceof TreeViewItem)) {
        return
      }

      fn(item)

      if (item.numChildren) {
        for (let i = 0; i < item.dom.childNodes.length; i += 1) {
          traverse(item.dom.childNodes[i].ui)
        }
      }
    }

    for (let i = 0; i < this.dom.childNodes.length; i += 1) {
      traverse(this.dom.childNodes[i].ui)
    }
  }

  /**
   * Do a depth first traversal of all tree items
   * and assign an order to them so that we know which one
   * is above the other. Performance wise this means it traverses
   * all tree items every time however seems to be pretty fast even with 15 - 20 K entities.
   */
  #updateTreeOrder () {
    let order = 0

    this.traverseDepthFirst((item) => {
      order += 1
      item.treeOrder = order
    })
  }

  _getChildIndex (item, parent) {
    return Array.prototype.indexOf.call(parent.dom.childNodes, item.dom) - 1
  }

  // Called when we start dragging a TreeViewItem.
  override _onChildDragStart (evt: MouseEvent, element: TreeViewItem) {
    if (!this.allowDrag || this.#dragging) {
      return
    }

    this.#dragItems = []

    if (this.#selectedItems.includes(element)) {
      const dragged: TreeViewItem[] = []

      /*
       * Check that all selected items to be dragged are
       * At the same depth from the root
       */
      let desiredDepth = -1
      for (let i = 0, l = this.#selectedItems.length; i < l; i += 1) {
        let parent = this.#selectedItems[i].parent
        let depth = 0
        let isChild = false
        while (parent && parent instanceof TreeViewItem) {
          /*
           * If parent is already in dragged items then skip
           * depth calculation for this item
           */
          if (this.#selectedItems.includes(parent)) {
            isChild = true
            break
          }

          depth += 1
          parent = parent.parent
        }

        if (!isChild) {
          if (desiredDepth === -1) {
            desiredDepth = depth
          } else if (desiredDepth !== depth) {
            return
          }

          dragged.push(this.#selectedItems[i])
        }
      }

      // Add dragged class to each item
      this.#dragItems = dragged
    } else {
      element.dom.classList.add(CLASS_DRAGGED_ITEM)
      this.#dragItems.push(element)
    }

    if (this.#dragItems.length > 0) {
      for (let i = 0, l = this.#dragItems.length; i < l; i += 1) {
        this.#dragItems[i].dom.classList.add(CLASS_DRAGGED_ITEM)
      }

      this.isDragging = true

      this.emit('dragstart', this.#dragItems.slice())
    }
  }

  // Called when we stop dragging a TreeViewItem.
  override _onChildDragEnd (evt: MouseEvent, element: Element) {
    if (!this.allowDrag || !this.#dragging) {
      return
    }

    for (let i = 0, l = this.#dragItems.length; i < l; i += 1) {
      this.#dragItems[i].dom.classList.remove(CLASS_DRAGGED_ITEM)
    }

    /*
     * If the root is being dragged then
     * Do not allow reparenting because we do not
     * Want to reparent the root
     */
    let isRootDragged = false
    for (let i = 0; i < this.#dragItems.length; i += 1) {
      if (this.#dragItems[i].parent === this) {
        isRootDragged = true
        break
      }
    }

    if (!isRootDragged && this.#dragOverItem) {
      if (this.#dragItems.length > 1) {
        // Sort items based on order in the hierarchy
        this.#updateTreeOrder()
        this.#dragItems.sort((a, b) => {
          return a.treeOrder - b.treeOrder
        })
      }

      if (this.#dragItems.length > 0) {
        // Reparent items
        const reparented: { item: TreeViewItem, parent: Element | null }[] = []

        /*
         * If we have an onReparentFn then we will not perform the reparenting here
         * but will instead calculate the new indexes and pass that data to the reparent function
         * to perform the reparenting
         */
        if (this.onReparentFn) {
          const fakeDom: { parent: TreeViewItem, children: ChildNode[] }[] = []

          const getChildren = (treeviewItem: Element | null) => {
            let idx = -1

            for (let i = 0, l = fakeDom.length; i < l; i += 1) {
              if (fakeDom[i].parent === treeviewItem) {
                idx = i
                break
              }
            }

            if (idx === -1) {
              fakeDom.push({
                children: [...treeviewItem.dom.childNodes],
                parent: treeviewItem,
              })
              idx = fakeDom.length - 1
            }

            return fakeDom[idx].children
          }

          for (let i = 0, l = this.#dragItems.length; i < l; i += 1) {
            const item = this.#dragItems[i]

            if (item.parent === this.#dragOverItem && this._dragArea === DRAG_AREA_INSIDE) {
              continue
            }

            reparented.push({
              item,
              oldParent: item.parent,
            })

            // Add array of parent's child nodes to fakeDom array
            const parentChildren = getChildren(item.parent)

            // Remove this item from the children array in fakeDom
            const childIdx = parentChildren.indexOf(item.dom)
            parentChildren.splice(childIdx, 1)
          }

          // Now reparent items
          for (let i = 0, l = reparented.length; i < l; i += 1) {
            const r = reparented[i]
            if (this._dragArea === DRAG_AREA_BEFORE) {
              // If dragged before a TreeViewItem...
              r.newParent = this.#dragOverItem.parent
              const parentChildren = getChildren(this.#dragOverItem.parent)
              const index = parentChildren.indexOf(this.#dragOverItem.dom)
              parentChildren.splice(index, 0, r.item.dom)
              r.newChildIndex = index
            } else if (this._dragArea === DRAG_AREA_INSIDE) {
              // If dragged inside a TreeViewItem...
              r.newParent = this.#dragOverItem
              const parentChildren = getChildren(this.#dragOverItem)
              parentChildren.push(r.item.dom)
              r.newChildIndex = parentChildren.length - 1
            } else if (this._dragArea === DRAG_AREA_AFTER) {
              // If dragged after a TreeViewItem...
              r.newParent = this.#dragOverItem.parent
              const parentChildren = getChildren(this.#dragOverItem.parent)
              const after = i > 0 ? reparented[i - 1].item : this.#dragOverItem
              const index = parentChildren.indexOf(after.dom)
              parentChildren.splice(index + 1, 0, r.item.dom)
              r.newChildIndex = index + 1
            }

            /*
             * Substract 1 from new child index to account for the extra node that
             * each tree view item has inside
             */
            r.newChildIndex -= 1
          }
        } else {
          /*
           * If we do not have onReparentFn then reparent all the dragged items
           * In the DOM
           */
          // First remove all items from their parent
          for (let i = 0, l = this.#dragItems.length; i < l; i += 1) {
            const item = this.#dragItems[i]
            if (item.parent === this.#dragOverItem && this._dragArea === DRAG_AREA_INSIDE) {
              return
            }

            reparented.push({
              item,
              oldParent: item.parent,
            })
            item.parent.remove(item)
          }

          // Now reparent items
          for (let i = 0, l = reparented.length; i < l; i += 1) {
            const r = reparented[i]
            if (this._dragArea === DRAG_AREA_BEFORE) {
              // If dragged before a TreeViewItem...
              r.newParent = this.#dragOverItem.parent
              this.#dragOverItem.parent.appendBefore(r.item, this.#dragOverItem)
              r.newChildIndex = this._getChildIndex(r.item, r.newParent)
            } else if (this._dragArea === DRAG_AREA_INSIDE) {
              // If dragged inside a TreeViewItem...
              r.newParent = this.#dragOverItem
              this.#dragOverItem.append(r.item)
              this.#dragOverItem.open = true
              r.newChildIndex = this._getChildIndex(r.item, r.newParent)
            } else if (this._dragArea === DRAG_AREA_AFTER) {
              // If dragged after a TreeViewItem...
              r.newParent = this.#dragOverItem.parent
              this.#dragOverItem.parent.appendAfter(r.item, i > 0 ? reparented[i - 1].item : this.#dragOverItem)
              r.newChildIndex = this._getChildIndex(r.item, r.newParent)
            }
          }
        }

        if (reparented.length > 0) {
          if (this.onReparentFn) {
            this.onReparentFn(reparented)
          }

          this.emit('reparent', reparented)
        }
      }
    }

    this.#dragItems = []

    this.isDragging = false

    this.emit('dragend')
  }

  // Called when we drag over a TreeViewItem.
  _onChildDragOver (evt: MouseEvent, element: TreeViewItem) {
    if (!this.#allowDrag || !this.#dragging) {
      return
    }

    if (element.allowDrop && !this.#dragItems.includes(element)) {
      this.#dragOverItem = element
    } else {
      this.#dragOverItem = null
    }

    this.#updateDragHandle()
    this.#onDragMove(evt)
  }

  // Called when the mouse cursor leaves the tree view.
  #onMouseLeave = (evt: MouseEvent) => {
    if (!this.#allowDrag || !this.#dragging) {
      return
    }

    this.#dragOverItem = null
    this.#updateDragHandle()
  }

  // Called when the mouse moves while dragging
  #onMouseMove = (evt: MouseEvent) => {
    if (!this.#dragging) {
      return
    }

    // Determine if we need to scroll the treeview if we are dragging towards the edges
    const rect = this.dom.getBoundingClientRect()
    this._dragScroll = 0
    let top = rect.top

    let bottom = rect.bottom
    if (this._dragScrollElement !== this) {
      const dragScrollRect = this._dragScrollElement.dom.getBoundingClientRect()
      top = Math.max(top + this._dragScrollElement.dom.scrollTop, dragScrollRect.top)
      bottom = Math.min(bottom + this._dragScrollElement.dom.scrollTop, dragScrollRect.bottom)
    }

    top = Math.max(0, top)
    bottom = Math.min(bottom, document.body.clientHeight)

    if (evt.pageY < top + 32 && this._dragScrollElement.dom.scrollTop > 0) {
      this._dragScroll = -1
    } else if (
      evt.pageY > bottom - 32 &&
      this._dragScrollElement.dom.scrollHeight > this._dragScrollElement.height + this._dragScrollElement.dom.scrollTop
    ) {
      this._dragScroll = 1
    }
  }

  // Scroll treeview if we are dragging towards the edges
  #scrollWhileDragging = () => {
    if (!this.#dragging) {
      return
    }
    if (this._dragScroll === 0) {
      return
    }

    this._dragScrollElement.dom.scrollTop += this._dragScroll * 8
    this.#dragOverItem = null
    this.#updateDragHandle()
  }

  // Called while we drag the drag handle
  #onDragMove = (evt: MouseEvent) => {
    evt.preventDefault()
    evt.stopPropagation()

    if (!this.#allowDrag || !this.#dragOverItem) {
      return
    }

    const rect = this._dragHandle.dom.getBoundingClientRect()
    const area = Math.floor((evt.clientY - rect.top) / rect.height * 5)

    const oldArea = this._dragArea
    const oldDragOver = this.#dragOverItem

    if (this.#dragOverItem.parent === this) {
      let parent = false
      for (let i = 0; i < this.#dragItems.length; i += 1) {
        if (this.#dragItems[i].parent === this.#dragOverItem) {
          parent = true
          this.#dragOverItem = null
          break
        }
      }

      if (!parent) {
        this._dragArea = DRAG_AREA_INSIDE
      }
    } else {
      // Check if we are trying to drag item inside any of its children
      let invalid = false
      for (let i = 0; i < this.#dragItems.length; i += 1) {
        if (this.#dragItems[i].dom.contains(this.#dragOverItem.dom)) {
          invalid = true
          break
        }
      }

      if (invalid) {
        this.#dragOverItem = null
      } else if (
        this.allowReordering && area <= 1 &&
        !this.#dragItems.includes(this.#dragOverItem.previousSibling)
      ) {
        this._dragArea = DRAG_AREA_BEFORE
      } else if (
        this.allowReordering && area >= 4 &&
        !this.#dragItems.includes(this.#dragOverItem.nextSibling) &&
        (this.#dragOverItem.numChildren === 0 || !this.#dragOverItem.open)
      ) {
        this._dragArea = DRAG_AREA_AFTER
      } else {
        let parent = false
        if (this.allowReordering && this.#dragOverItem.open) {
          for (let i = 0; i < this.#dragItems.length; i += 1) {
            if (this.#dragItems[i].parent === this.#dragOverItem) {
              parent = true
              this._dragArea = DRAG_AREA_BEFORE
              break
            }
          }
        }

        if (!parent) {
          this._dragArea = DRAG_AREA_INSIDE
        }
      }
    }

    if (oldArea !== this._dragArea || oldDragOver !== this.#dragOverItem) {
      this.#updateDragHandle()
    }
  }

  // Updates the drag handle position and size
  #updateDragHandle (element?: TreeViewItem, force?: boolean) {
    if (!force && (!this.#allowDrag || !this.#dragging)) {
      return
    }

    const item = element ?? this.#dragOverItem

    if (!item || item.hidden || !item.parentsOpen) {
      this._dragHandle.hidden = true
    } else {
      const handle = this._dragHandle
      const rect = item.containerContents.dom.getBoundingClientRect()

      handle.hidden = false
      handle.dom.classList.remove(DRAG_AREA_AFTER, DRAG_AREA_BEFORE, DRAG_AREA_INSIDE)
      handle.dom.classList.add(this._dragArea)

      const { top } = rect
      let { left, width } = rect
      if (this.dom.parentElement) {
        const parentRect = this.dom.parentElement.getBoundingClientRect()
        left = Math.max(left, parentRect.left)
        width = Math.min(width, this.dom.parentElement.clientWidth - left + parentRect.left)
      }

      handle.dom.style.top = `${top}px`
      // handle.dom.style.left = `${left}px`
      handle.dom.style.width = `${width - 7}px`
    }
  }

  /**
   * Selects a tree view item
   *
   * @param item - The tree view item
   */
  _selectSingleItem (item: TreeViewItem) {
    let i = this.#selectedItems.length
    let othersSelected = false

    while (i--) {
      if (this.#selectedItems[i] && this.#selectedItems[i] !== item) {
        this.#selectedItems[i].selected = false
        othersSelected = true
      }
    }

    if (othersSelected) {
      item.selected = true
    } else {
      item.selected = !item.selected
    }
  }

  /**
   * Called when a child tree view item is selected.
   *
   * @param item - The tree view item.
   */
  _onChildSelected (item: TreeViewItem) {
    this.#selectedItems.push(item)
    item.parentsOpen = true
    this.emit('select', item)
  }

  /**
   * Called when a child tree view item is deselected.
   *
   * @param element - The element.
   */
  _onChildDeselected (element: TreeViewItem) {
    const index = this.#selectedItems.indexOf(element)
    if (index !== -1) {
      this.#selectedItems.splice(index, 1)
      this.emit('deselect', element)
    }
  }

  /**
   * Called when a child tree view item is renamed.
   *
   */
  _onChildRename (item: TreeViewItem, newName: string | null | undefined) {
    if (this._filter) {
      // Unfilter this item
      item.dom.classList.remove(CLASS_FILTER_RESULT)
      const index = this._filterResults.indexOf(item)
      if (index !== -1) {
        this._filterResults.splice(index, 1)
      }

      // See if we can include it in the current filter
      this._searchItems([[item.text, item]], this._filter)
    }
    this.emit('rename', item, newName)
  }

  _searchItems (searchArr, filter) {
    const results = searchItems(searchArr, filter)

    if (results.length < 1) {
      return
    }

    results.forEach((item) => {
      this._filterResults.push(item)
      item.dom.classList.add(CLASS_FILTER_RESULT)
    })
  }

  /**
   * Searches treeview
   *
   * @param filter - The search filter
   */
  _applyFilter (filter: string) {
    this._clearFilter()

    this.#wasDraggingAllowedBeforeFiltering = this.#allowDrag
    this.#allowDrag = false

    this.dom.classList.add(CLASS_FILTERING)

    const search: [string | null | undefined, TreeViewItem][] = []
    this.traverseDepthFirst((item) => {
      search.push([item.text, item])
    })

    this._searchItems(search, filter)
  }

  /**
   * Clears search filter.
   */
  _clearFilter () {
    this._filterResults.forEach((item) => {
      if (item.destroyed) {
        return
      }
      item.dom.classList.remove(CLASS_FILTER_RESULT)
    })
    this._filterResults.length = 0

    this.dom.classList.remove(CLASS_FILTERING)

    this.#allowDrag = this.#wasDraggingAllowedBeforeFiltering
  }

  showDragHandle (treeItem: TreeViewItem) {
    this.#updateDragHandle(treeItem, true)
  }

  /**
   * @name TreeView#deselect
   * @description Deselects all selected tree view items.
   */
  deselect () {
    let i = this.#selectedItems.length - 1
    while (i > -1) {
      if (this.#selectedItems[i]) {
        this.#selectedItems[i].selected = false
      }

      i -= 1
    }
  }

  /**
   * @name TreeView#clearTreeItems
   * @description Removes all child tree view items
   */
  clearTreeItems () {
    let i = this.dom.childNodes.length - 1

    while (i > -1) {
      const dom = this.dom.childNodes[i]
      if (!dom) {
        i -= 1
        continue
      }

      const ui = dom.ui
      if (ui instanceof TreeViewItem) {
        ui.destroy()
      }

      i -= 1
    }

    this.#selectedItems = []
    this.#dragItems = []
    this.#allowDrag = this.#wasDraggingAllowedBeforeFiltering
  }

  override destroy () {
    if (this.destroyed) {
      return
    }

    window.removeEventListener('keydown', this._updateModifierKeys)
    window.removeEventListener('keyup', this._updateModifierKeys)
    window.removeEventListener('mousedown', this._updateModifierKeys)
    window.removeEventListener('mousemove', this.#onMouseMove)

    this.dom.removeEventListener('mouseleave', this.#onMouseLeave)

    if (this.#dragScrollInterval > -1) {
      clearInterval(this.#dragScrollInterval)
      this.#dragScrollInterval = -1
    }

    super.destroy()
  }

  /**
   * @property {boolean} allowDrag=true Whether dragging a TreeViewItem is allowed.
   */
  set allowDrag (value) {
    this.#allowDrag = value
    if (this._filter) {
      this.#wasDraggingAllowedBeforeFiltering = value
    }
  }

  get allowDrag () {
    return this.#allowDrag
  }

  set isDragging (value) {
    if (this.#dragging === value) {
      return
    }

    if (value) {
      this.#dragging = true
      this.#updateDragHandle()

      // Handle mouse move to scroll when dragging if necessary
      if (this.scrollable || this._dragScrollElement !== this) {
        window.removeEventListener('mousemove', this.#onMouseMove)
        window.addEventListener('mousemove', this.#onMouseMove)
        if (this.#dragScrollInterval === -1) {
          this.#dragScrollInterval = setInterval(this.#scrollWhileDragging, 1000 / 60)
        }
      }
    } else {
      this.#dragOverItem = null
      this.#updateDragHandle()

      this.#dragging = false

      window.removeEventListener('mousemove', this.#onMouseMove)
      if (this.#dragScrollInterval > -1) {
        clearInterval(this.#dragScrollInterval)
        this.#dragScrollInterval = -1
      }
    }
  }

  get isDragging () {
    return this.#dragging
  }

  get selected () {
    return this.#selectedItems.slice()
  }

  set filter (value) {
    if (this._filter === value) {
      return
    }

    this._filter = value

    if (value) {
      this._applyFilter(value)
    } else {
      this._clearFilter()
    }
  }

  get filter () {
    return this._filter
  }

  get pressedCtrl () {
    return this._pressedCtrl
  }

  get pressedShift () {
    return this._pressedShift
  }
}

export default TreeView
