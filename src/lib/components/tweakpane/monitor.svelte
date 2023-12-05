<script lang='ts'>
  import { onDestroy } from 'svelte'
  import type { BindingParams } from 'tweakpane'
  import { getParent } from './context'

  // generic for the bound value type of this monitor
  type T = $$Generic

  /**
   * The binding target.
   */
  export let params: object

  /**
   * The key of the target property.
   */
  export let key: string

  /**
   * The options of a binding.
   */
  export let monitorParams: BindingParams | undefined = undefined
  export let index: number | undefined = undefined
  export let interval: number | undefined = undefined

  const monitor = getParent()
    .addBinding<any, any>(params, key, {
      ...monitorParams,
      index,
      interval,
      readonly: true,
    })

  onDestroy(() => monitor.dispose())
</script>

<slot />