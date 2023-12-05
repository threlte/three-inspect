<script lang='ts'>

import { onDestroy, onMount } from 'svelte'
import { HierarchicalObject, T } from '@threlte/core'
import Portal from './portal.svelte'
import Panes from './panes.svelte'
import CameraControls from './camera-controls.svelte'
import { getInspectorContext } from './context'

let ref: HTMLElement
let refParent: HTMLElement

const { scene, renderer } = getInspectorContext()

onMount(() => {
  refParent = renderer.current.domElement.parentElement ?? document.body
  ref.replaceWith(renderer.current.domElement)
})

onDestroy(() => {
  refParent.append(renderer.current.domElement)
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

  <T.PerspectiveCamera
    name='Inspect camera'
    makeDefault
    fov={50}
    position={[1, 1, 1]}
    on:create={({ ref }) => ref.lookAt(0, 0, 0)}
    userData.threeInspectHide={true}
  >
    <CameraControls />
  </T.PerspectiveCamera>
</HierarchicalObject>

<style>
  :root {
    --tp-base-border-radius: 0 !important;
    --tp-base-shadow-color: transparent !important;
  }
</style>