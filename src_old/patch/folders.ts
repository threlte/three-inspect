import * as Tweakpane from 'tweakpane'
import { load, save } from 'trzy'

type Pane = Tweakpane.Pane | Tweakpane.FolderApi

const folders: Pane[] = []

const addFolder = Tweakpane.FolderApi.prototype.addFolder
const dispose = Tweakpane.FolderApi.prototype.dispose

Tweakpane.FolderApi.prototype.addFolder = function (params: Tweakpane.FolderParams) {
  const id = `${String(params.index ?? -1)}.${params.title}`

  const folder = addFolder.call(this, {
    expanded: load(`pane.${id}`) !== null,
    ...params,
  })
  folders.push(folder)

  folder.element.id = id

  folder.on('fold', (event) => {
    const key = `pane.${id}`

    if (event.expanded) {
      save(key, true)
    } else {
      save(key, null)
    }
  })

  return folder
}

Tweakpane.FolderApi.prototype.dispose = function () {
  dispose.call(this)
  folders.splice(folders.indexOf(this), 1)
}
