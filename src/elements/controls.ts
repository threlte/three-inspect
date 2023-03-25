import { TreeViewItem, TreeViewWebComponent } from 'flexible-tree'
import { refs } from '../refs'

export const createControls = () => {
  const controls = document.createElement('div')
  controls.className = 'relative flex flex-col grow bg-[#28292e]'
  refs.debugRoot = controls

  const nav = document.createElement('nav')
  nav.className = 'tp-rotv z-50 sticky flex top-0 w-full overflow-x-auto z-1 bg-[#28292e] font-mono text-[11px]'
  controls.append(nav)

  const worldPane = document.createElement('section')
  worldPane.className = 'flex flex-col grow overflow-x-hidden overflow-y-auto'
  worldPane.dataset.pane = 'World'
  controls.append(worldPane)

  const treeview = new TreeViewWebComponent()
  treeview.scrollable = true
  treeview.allowRenaming = false
  treeview.resizable = 'bottom'
  treeview.dom.style.cssText = 'font-family: monospace; font-size: 11px;'

  treeview.wc.classList.add('sticky', 'top-0', 'z-10', 'bg-[#333]')
  worldPane.append(treeview.wc)

  const treeroot = new TreeViewItem({ text: 'Scene' })
  treeview.append(treeroot)

  const pane = document.createElement('div')
  worldPane.append(pane)

  return { controls, nav, pane, treeroot, treeview }
}
