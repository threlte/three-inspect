import { TreeView, TreeViewItem, resizable } from 'flexible-tree'

export const createControls = () => {
  const controls = document.createElement('div')
  controls.className = 'relative flex flex-col grow bg-[#28292e]'

  const nav = document.createElement('nav')
  nav.className = 'tp-rotv z-50 sticky flex top-0 w-full overflow-x-auto z-1 bg-[#28292e] font-mono text-[11px]'
  controls.append(nav)

  const worldPane = document.createElement('section')
  worldPane.className = 'flex flex-col grow overflow-x-hidden overflow-y-auto'
  worldPane.dataset.pane = 'World'
  controls.append(worldPane)

  const treeview = new TreeView()
  treeview.scrollable = true
  treeview.allowRenaming = false

  const tree = resizable({
    element: treeview.domElement,
    height: 300,
    max: Infinity,
    side: 'bottom',
  })
  tree.style.cssText += '--color-resize-handle: #222;'
  tree.style.position = 'sticky'
  tree.classList.add('top-0', 'z-10')

  worldPane.append(tree)

  const treeroot = new TreeViewItem({ text: 'Scene' })
  treeview.append(treeroot)

  const pane = document.createElement('div')
  pane.classList.add('grow')
  worldPane.append(pane)

  return { controls, nav, pane, treeroot, treeview }
}
