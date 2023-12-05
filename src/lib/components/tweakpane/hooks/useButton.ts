import type { FolderApi, TabPageApi } from 'tweakpane'
import { getParent } from '../context'
import { onDestroy } from 'svelte'

export const useButton = (options: {
  title: string
  label?: string
  onClick: () => void
  parent?: FolderApi | TabPageApi
}) => {
  const button = getParent().addButton({
    title: options.title,
    label: options.label ?? options.title,
  })

  button.on('click', options.onClick)

  onDestroy(() => button.dispose())
}
