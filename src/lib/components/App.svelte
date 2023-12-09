<script lang='ts'>
  import { T, HierarchicalObject, useThrelte } from '@threlte/core'
  import { Grid } from '@threlte/extras'
  import { AxesHelper } from 'trzy'
  import { persisted } from '../internal/persisted'
  import { getInternalContext, useInspector } from '../internal/context'
  import { add } from '../hooks/useOnAdd'
  import { remove } from '../hooks/useOnRemove'
  import Portal from './Internal/Portal.svelte'
  import FreeCamera from './Tools/FreeCamera.svelte'
  import Raycast from './Tools/Raycast.svelte'
  import Splitpanes from './Splitpanes.svelte'
  import Tweakpane from './Tweakpane.svelte'
  import TransformControls from './Tools/TransformControls.svelte'
  import Helpers from './Tools/Helpers.svelte'

  const { position } = useInspector()
  const { scene } = useThrelte()
  const { usingFreeCamera, usingRaycast, selectedObject } = getInternalContext()

  let grid = persisted('grid', true)
  let axes = persisted('axes', true)

  $: object = $selectedObject
</script>

{#if $position === 'inline'}
  <Portal style='position:fixed; top:0; left:0; width:100vw; height:100vh;'>
    <Splitpanes>
      <slot />
    </Splitpanes>
  </Portal>
{:else}
  <Portal>
    <Tweakpane>
      <slot />
    </Tweakpane>
  </Portal>
{/if}

<!-- Ensure that all inspector objects are added to the scene passed to the inspector -->
<HierarchicalObject
  onChildMount={(child) => add.call(scene, child)}
  onChildDestroy={(child) => remove.call(scene, child)}
>
  {#if $grid}
    <Grid
      infiniteGrid
      cellSize={1}
      renderOrder={9999}
      sectionColor='#555'
    />
  {/if}

  {#if $axes}
    <T
      is={AxesHelper}
      length={1000}
      width={0.2}
    />
  {/if}

  {#if $usingFreeCamera}
    <FreeCamera />
  {/if}

  {#if $usingRaycast}
    <Raycast />
  {/if}

  {#if object && !('isScene' in object)}
    {#key object}
      <TransformControls {object} />
    {/key}
    <Helpers {object} />
  {/if}
</HierarchicalObject>
