import { TreeView } from '../treeview'
import { TreeViewItem } from '../treeview/item'

export const createControls = () => {
  const controls = document.createElement('div')
  controls.className = 'relative flex flex-col h-screen bg-[#28292e] w-auto'

  const nav = document.createElement('nav')
  nav.className = 'tp-rotv sticky top-0 three-inspect-nav'
  controls.append(nav)

  const worldPane = document.createElement('section')
  worldPane.className = 'h-screen flex flex-col overflow-x-hidden overflow-y-auto'
  worldPane.dataset.pane = 'World'
  controls.append(worldPane)

  const treeview = new TreeView()
  treeview.dom.classList.add('sticky', 'top-0')
  treeview.allowRenaming = false
  treeview.resizable = 'bottom'
  treeview.resizeMax = Infinity
  treeview.dom.style.height = '300px'
  worldPane.append(treeview.dom)

  const treeroot = new TreeViewItem({ text: 'Scene' })
  treeview.append(treeroot)

  const pane = document.createElement('div')
  pane.className = 'grow'
  worldPane.append(pane)

  return { controls, nav, pane, treeroot, treeview }
}
