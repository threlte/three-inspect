<script lang='ts'>
  import { onMount } from 'svelte'
  import { HierarchicalObject } from '@threlte/core'
  import Portal from './Internal/Portal.svelte'
  import Panes from './panes.svelte'
  import { getInspectorContext } from '../context'

  let ref: HTMLElement

  const { scene, renderer } = getInspectorContext()

  onMount(() => {
    const refParent = renderer.current.domElement.parentElement ?? document.body
    ref.replaceWith(renderer.current.domElement)
    return () => refParent.append(renderer.current.domElement)
  })
</script>

<HierarchicalObject
  onChildMount={(child) => scene.current.add(child)}
  onChildDestroy={(child) => scene.current.remove(child)}
>
  <Portal>
    <Panes>
      <div style='height: 100vh' bind:this={ref} />
    </Panes>
  </Portal>
</HierarchicalObject>
