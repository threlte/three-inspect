<script lang='ts'>
  import { Pane, ThemeUtils, Element, Separator } from 'svelte-tweakpane-ui'
  import Tree from '../Tree/Tree.svelte'
  import Bindings from '../Bindings/index.svelte'
  import IconButton from '../Internal/IconButton.svelte'
  import Perf from '../Internal/Perf.svelte'
  import { getInternalContext } from '../../internal/context'
  import { browser } from '$lib/internal/browser';

  const { usingFreeCamera, usingRaycast } = getInternalContext()

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
    <div style='display:flex; gap: 0.25rem; margin-bottom: 0.25rem'>
      <IconButton
        label='Raycast'
        icon='mdiCursorDefault'
        on:click={() => usingRaycast.set(!usingRaycast.current)}
      />
      <IconButton
        label='Free camera'
        icon='mdiCameraOutline'
        on:click={() => usingFreeCamera.set(!usingFreeCamera.current)}
      />
    </div>
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

<Pane
  title='Object3D'
  position='draggable'
  theme={ThemeUtils.presets[themeKey]}
  localStoreId='three-inspect-pane-selected-object'
  storePositionLocally
  width={320}
  x={browser ? window.innerWidth - 6 - 320 : 6}
  y={6}
>
  <Bindings />
</Pane>