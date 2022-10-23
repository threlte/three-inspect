import * as EssentialsPlugin from '@tweakpane/plugin-essentials'
import * as RotationPlugin from '@0b5vr/tweakpane-plugin-rotation'
import * as Tweakpane from 'tweakpane'

export type Pane = Tweakpane.Pane | Tweakpane.FolderApi

export let pane: Pane

export const createPane = (container?: HTMLElement) => {
  const newPane = new Tweakpane.Pane({ container })
  newPane.registerPlugin(EssentialsPlugin)
  newPane.registerPlugin(RotationPlugin)
  return newPane
}
