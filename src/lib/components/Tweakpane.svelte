<script lang='ts'>
  import { Pane, TabGroup, TabPage, ThemeUtils, Element, Separator } from 'svelte-tweakpane-ui'
  import Tree from './Tree/Tree.svelte'
  import Bindings from './Bindings/index.svelte'
  import IconButton from './Internal/IconButton.svelte'
  import { getInternalContext, useInspector } from '../internal/context';

  const { usingFreeCamera, usingRaycast } = getInternalContext()
  const { position } = useInspector()

  let themeKey: keyof typeof ThemeUtils.presets = 'light'
</script>

<Pane
  title={$position === 'draggable' ? '' : undefined}
  position={$position}
  theme={ThemeUtils.presets[themeKey]}
  localStoreId='three-inspect-pane'
  storePositionLocally
  userExpandable={false}
>
  <TabGroup theme={ThemeUtils.presets[themeKey]}>
    <TabPage title='inspect'>
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

      <Bindings />
    </TabPage>

    <slot />
  </TabGroup>
</Pane>
