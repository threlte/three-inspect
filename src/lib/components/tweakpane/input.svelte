<script lang='ts' context='module'>
  const formatter = new Intl.NumberFormat(undefined, { maximumSignificantDigits: 3 })
  const format = (v: number) => formatter.format(v)
</script>

<script lang="ts">
  import { onDestroy } from 'svelte'
  import { createRawEventDispatcher } from '@threlte/core'
  import type { TpChangeEvent, BindingParams } from '@tweakpane/core'
  import { getParent } from './context'

  // generic for the bound value type of this input
  type T = $$Generic

  /** The binding target. */
  export let params: Record<string, any> = {}

  /** The key of the target property. */
  export let key: keyof typeof params

  export let value: any | undefined = undefined

  /** The options of a binding. */
  export let inputParams: BindingParams | undefined = undefined

  export let index: number | undefined = undefined

  export let disabled = false
  export let hidden = false

  export let label: string | false | undefined = undefined

  export let min: number | undefined = undefined

  export let max: number | undefined = undefined

  export let step: number | undefined = undefined

  export let options: Record<string, any> | undefined = undefined

  const dispatch = createRawEventDispatcher<{
    change: TpChangeEvent<T>
    click: MouseEvent
  }>()

  const parent = getParent()

  if (value !== undefined) params[key] = value

  export const binding = parent.addBinding(params, key, {
      format,
      ...inputParams,
      index,
      min,
      max,
      step,
      options,
    })
    .on('change', (event) => dispatch('change', event))

  $: binding!.disabled = disabled
  $: binding!.hidden = hidden
  $: if (label !== undefined) {
    binding!.label = typeof label === 'boolean' ? undefined : label
  }

  onDestroy(() => binding.dispose())
</script>
