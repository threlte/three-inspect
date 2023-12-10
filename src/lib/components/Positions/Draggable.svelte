<script lang='ts'>
  import { Pane, ThemeUtils, Element, Separator } from 'svelte-tweakpane-ui'
  import { getInternalContext } from '../../internal/context'
  import { browser } from '../../internal/browser'
  import Tree from '../Tree/Tree.svelte'
  import Bindings from '../Bindings/Bindings.svelte'
  import Tools from '../Tools/Tools.svelte'
  import Perf from '../Internal/Perf.svelte'

  const { selectedObject } = getInternalContext()

  let themeKey: keyof typeof ThemeUtils.presets = 'light'
</script>

<Pane
  title=''
  position='draggable'
  theme={ThemeUtils.presets[themeKey]}
  localStoreId='three-inspect-pane-inspect'
  storePositionLocally
  width={250}
  x={6}
  y={6}
>
  <Element>
    <Tools />
  </Element>

  <Separator />

  <Element>
    <Tree />
  </Element>

  <slot />
</Pane>

<Pane
  title=''
  position='draggable'
  theme={ThemeUtils.presets[themeKey]}
  localStoreId='three-inspect-pane-monitor'
  storePositionLocally
  width={325}
  x={6}
  y={browser ? window.innerHeight - 6 - 125 : 6}
>
  <Element>
    <Perf />
  </Element>
</Pane>

{#if $selectedObject}
  <Pane
    title={$selectedObject.name}
    position='draggable'
    theme={ThemeUtils.presets[themeKey]}
    localStoreId='three-inspect-pane-selected-object'
    storePositionLocally
    width={320}
    x={browser ? window.innerWidth - 6 - 320 : 6}
    y={6}
  >
    <Bindings object={$selectedObject} />
  </Pane>
{/if}
