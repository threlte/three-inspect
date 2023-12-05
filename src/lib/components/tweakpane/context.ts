import type { FolderApi, Pane, TabPageApi } from 'tweakpane'
import { getContext, setContext } from 'svelte'

export type ParentContext = Pane | FolderApi | TabPageApi

const contextKey = Symbol('sveltepane')
const parentKey = Symbol('sveltepane-parent-blade')

export const setPane = (context: Pane) => {
  setContext(contextKey, context)
  return context
}

export const getPane = () => {
  return getContext(contextKey)
}

export const getParent = () => {
  return getContext<ParentContext>(parentKey)
}

export const setParent = (parent: ParentContext) => {
  return setContext(parentKey, parent)
}
