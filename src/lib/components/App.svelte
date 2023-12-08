<script lang='ts'>
  import { HierarchicalObject } from '@threlte/core'
  import { getInternalContext, useInspector } from '../internal/context'
  import { add } from '../hooks/useOnAdd'
  import { remove } from '../hooks/useOnRemove'
  import Portal from './Internal/Portal.svelte'
  import FreeCamera from './Tools/FreeCamera.svelte'
  import Splitpanes from './Splitpanes.svelte'
  import Tweakpane from './Tweakpane.svelte'
  import TransformControls from './Tools/TransformControls.svelte'
  import Helpers from './Tools/Helpers.svelte'

  const { position } = useInspector()
  const { scene, usingFreeCamera, selectedObject } = getInternalContext()

  $: object = $selectedObject
</script>

<!-- Ensure that all inspector objects are added to the scene passed to the inspector -->
<HierarchicalObject
  onChildMount={(child) => add.call($scene, child)}
  onChildDestroy={(child) => remove.call($scene, child)}
>
  {#if $position === 'inline'}
    <Portal>
      <div>
        <Splitpanes>
          <slot />
        </Splitpanes>
      </div>
    </Portal>
  {:else}
    <Portal>
      <Tweakpane>
        <slot />
      </Tweakpane>
    </Portal>
  {/if}
  
  {#if $usingFreeCamera}
    <FreeCamera />
  {/if}

  {#if object}
    <TransformControls {object} />
    <Helpers {object} />
  {/if}
</HierarchicalObject>

<style>
  div {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
</style>
