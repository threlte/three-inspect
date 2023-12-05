import * as EssentialsPlugin from '@tweakpane/plugin-essentials'
import * as ImagePlugin from 'tweakpane-image-plugin'
import * as RotationPlugin from '@0b5vr/tweakpane-plugin-rotation'
import * as TextareaPlugin from '@pangenerator/tweakpane-textarea-plugin'
import * as Tweakpane from 'tweakpane'

export type Pane = Tweakpane.Pane | Tweakpane.FolderApi

export let pane: Pane

export const createPane = (container?: HTMLElement) => {
  const nextPane = new Tweakpane.Pane({ container })
  nextPane.registerPlugin(EssentialsPlugin)
  nextPane.registerPlugin(ImagePlugin)
  nextPane.registerPlugin(RotationPlugin)
  nextPane.registerPlugin(TextareaPlugin)
  return nextPane
}
