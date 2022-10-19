import { TreeView } from '../treeview'
import { TreeViewItem } from '../treeview/item'

export const createControls = () => {
  const controls = document.createElement('div')
  controls.className = 'relative flex flex-col h-screen bg-[#28292e] w-auto overflow-x-hidden overflow-y-auto scroll'

  const nav = document.createElement('nav')
  nav.className = 'tp-rotv sticky top-0 three-debug-nav'
  controls.append(nav)

  const treeview = new TreeView({ class: ['sticky', 'top-0'] })
  // treeview.allowDrag = false
  // treeview.allowRenaming = false
  // treeview.allowReordering = false
  treeview.resizable = 'bottom'
  treeview.resizeMax = 500
  treeview.dom.style.height = '300px'
  controls.append(treeview.dom)

  const treeroot = new TreeViewItem({ text: 'Scene' })
  treeview.append(treeroot)

  const pane = document.createElement('div')
  pane.className = 'grow'
  controls.append(pane)

  return { controls, nav, pane, treeroot, treeview }
}
