import { Element } from './element'
import { Label } from './label'
import { Container } from './container'

const CLASS_ContextMenu = 'pcui-contextmenu'
const CLASS_ContextMenu_active = `${CLASS_ContextMenu}-active`
const CLASS_ContextMenu_parent = `${CLASS_ContextMenu}-parent`
const CLASS_ContextMenu_child = `${CLASS_ContextMenu}-child`
const CLASS_ContextMenu_parent_active = `${CLASS_ContextMenu_parent}-active`

interface Item {
  text: string,
  onClick: () => void
}

interface Args {
  triggerElement?: HTMLElement
  dom?: HTMLElement
  items: Item[]
}

/**
 * Represents a context menu.
 */
export class ContextMenu {
  /**
   * Creates a new ContextMenu.
   * @param {object[]} [args.items] - The array of items used to populate the array.
   * @param {object} [args.dom] - The dom element to attach this context menu to.
   * @param {object} [args.triggerElement] - Will trigger the context menu to open when right clicked. If undefined args.dom will be used.
   */
  constructor (args: Args = {}) {
    this._menu = new Container({ dom: args.dom })
    this._menu.contextMenu = this
    this.args = args
    this._menu.class.add(CLASS_ContextMenu)
    const menu = this._menu

    const removeMenu = () => {
      this._menu.class.remove(CLASS_ContextMenu_active)
      document.removeEventListener('click', removeMenu)
    }

    const triggerElement = args.triggerElement ?? args.dom?.parentElement

    if (triggerElement) {
      triggerElement.addEventListener('contextmenu', (event) => {
        event.preventDefault()
        event.stopPropagation()

        menu.class.add(CLASS_ContextMenu_active)
        const maxMenuHeight = args.items.length * 27.0
        const maxMenuWidth = 150.0

        let { clientX, clientY } = event
        if ((maxMenuHeight + clientY) > window.innerHeight) {
          const topDiff = (maxMenuHeight + clientY) - window.innerHeight
          clientY -= topDiff
        }
        if ((maxMenuWidth + clientX) > window.innerWidth) {
          const leftDiff = (maxMenuWidth + clientX) - window.innerWidth
          clientX -= leftDiff
        }
        menu.dom.setAttribute('style', `left: ${clientX}px; top: ${clientY}px`)
        document.addEventListener('click', removeMenu)
      })

      let mouseLeaveTimeout = -1
      menu.dom.addEventListener('mouseleave', () => {
        mouseLeaveTimeout = setTimeout(() => {
          removeMenu()
        }, 500)
      })
      menu.dom.addEventListener('mouseenter', () => {
        if (mouseLeaveTimeout) {
          clearTimeout(mouseLeaveTimeout)
        }
      })
    }

    if (!args.items) {
      return
    }

    args.items.forEach((menuItem, i) => {
      const menuItemElement = new Container()
      menuItemElement.dom.setAttribute('style', `top: ${i * 27.0}px`)
      if (menuItem.onClick) {
        menuItemElement.on('click', (e) => {
          e.stopPropagation()
          removeMenu()
          menuItem.onClick(e)
        })
      }
      const menuItemLabel = new Label({ text: menuItem.text })
      menuItemElement.append(menuItemLabel)
      this._menu.dom.append(menuItemElement.dom)
      if (menuItem.items) {
        menuItem.items.forEach((childItem, j) => {
          const childMenuItemElement = new Container({ class: CLASS_ContextMenu_child })
          childMenuItemElement.dom.setAttribute('style', `top: ${j * 27.0}px; left: 150px;`)
          childMenuItemElement.on('click', (e) => {
            e.stopPropagation()
            removeMenu()
            childItem.onClick(e)
          })
          const childMenuItemLabel = new Label({ text: childItem.text })
          childMenuItemElement.append(childMenuItemLabel)
          menuItemElement.append(childMenuItemElement)
        })
        menuItemElement.class.add(CLASS_ContextMenu_parent)
      }
      menuItemElement.dom.addEventListener('mouseover', (e) => {
        // If (!e.fromElement.classList.contains('pcui-contextmenu-parent')) return;
        this._menu.forEachChild((node) => node.class.remove(CLASS_ContextMenu_parent_active))
        menuItemElement.class.add(CLASS_ContextMenu_parent_active)

        const maxMenuHeight = menuItem.items ? menuItem.items.length * 27.0 : 0.0
        const maxMenuWidth = 150.0
        const left = e.clientX + maxMenuWidth > window.innerWidth ? -maxMenuWidth + 2.0 : maxMenuWidth
        let top = 0
        if (e.clientY + maxMenuHeight > window.innerHeight) {
          top = -maxMenuHeight + 27.0
        }
        menuItemElement.forEachChild((node, j) => {
          if (j === 0) {
            return
          }
          node.dom.setAttribute('style', `top: ${top + (j - 1) * 27.0}px; left: ${left}px;`)
        })
      })
    })
  }
}
