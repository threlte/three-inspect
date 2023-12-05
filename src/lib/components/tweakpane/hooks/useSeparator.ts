import type { BaseBladeParams } from 'tweakpane'
import { getParent } from '../context'
import { onDestroy } from 'svelte'

export const useSeparator = (params?: BaseBladeParams) => {
  const parent = getParent()
  const blade = parent.addBlade({ ...params, view: 'separator' })
  onDestroy(() => blade.dispose())
}
