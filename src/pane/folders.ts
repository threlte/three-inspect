import * as Tweakpane from 'tweakpane'
import { storage } from '../lib/storage'

type Pane = Tweakpane.Pane | Tweakpane.FolderApi

const folders: Pane[] = []

const addFolder = Tweakpane.FolderApi.prototype.addFolder
const dispose = Tweakpane.FolderApi.prototype.dispose

Tweakpane.FolderApi.prototype.addFolder = function (params: Tweakpane.FolderParams) {
  const id = `${String(params.index ?? -1)}.${params.title}`

  const folder = addFolder.call(this, {
    expanded: storage.get(`pane.${id}`) !== null,
    ...params,
  })
  folders.push(folder)

  folder.element.id = id

  folder.on('fold', (event) => {
    const key = `pane.${id}`

    if (event.expanded) {
      storage.set(key, '')
    } else {
      storage.remove(key)
    }
  })

  return folder
}

Tweakpane.FolderApi.prototype.dispose = function () {
  dispose.call(this)
  folders.splice(folders.indexOf(this), 1)
}

export const closeFolders = () => {
  for (let i = 0, l = folders.length; i < l; i += 1) {
    folders[i].expanded = false
  }
}
