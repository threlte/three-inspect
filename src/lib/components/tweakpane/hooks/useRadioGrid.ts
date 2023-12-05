import { type UseBindingOptions, useBinding } from './useBinding'

type Size = [length: number, height: number]
type Cells = <T>(x: number) => { title: string, value: T }

export const useRadioGrid = <Value = unknown>(options: UseBindingOptions<Value>, size: Size, cells: Cells) => {
  return useBinding({
    ...options,
    params: {
      ...options.params,
      view: 'radiogrid',
      groupName: '',
      size,
      cells,
    },
  })
}
