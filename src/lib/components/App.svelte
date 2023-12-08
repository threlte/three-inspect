<script lang='ts'>
  import { onMount } from 'svelte'
  import { HierarchicalObject } from '@threlte/core'
  import Portal from './Internal/Portal.svelte'
  import Splitpanes from './Splitpanes.svelte'
  import { getInternalContext } from '../internal/context'
  import { add } from '../hooks/useOnAdd'
  import { remove } from '../hooks/useOnRemove'

  let ref: HTMLElement

  const { scene, renderer } = getInternalContext()

  onMount(() => {
    const canvas = $renderer.domElement
    const oldParent = canvas.parentElement ?? document.body
    ref.replaceWith(canvas)
    return () => oldParent.append(canvas)
  })
</script>

<!-- Ensure that all inspector objects are added to the scene passed to the inspector -->
<HierarchicalObject
  onChildMount={(child) => {
    console.log(child)
    add.call($scene, child)
  }}
  onChildDestroy={(child) => remove.call($scene, child)}
>
  <Portal>
    <Splitpanes>
      <div slot='canvas' style='height: 100vh' bind:this={ref} />
      <slot />
    </Splitpanes>
  </Portal>
</HierarchicalObject>
