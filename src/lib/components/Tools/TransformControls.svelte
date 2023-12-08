<script lang='ts'>
  import { TransformControls } from '@threlte/extras'
  import type { TransformControls as TransformControlsType } from 'three/examples/jsm/controls/TransformControls'
  import { getInternalContext } from '../../internal/context'
  import { persisted } from '../../internal/persisted'
  import { add } from '../../hooks/useOnAdd'

  export let object: THREE.Object3D

  const { scene, usingTransformControls } = getInternalContext()

  type Modes = 'translate' | 'rotate' | 'scale'

  const mode = persisted<Modes>('transform-mode', 'translate')

  const keydown = (event: KeyboardEvent) => {
    if (event.metaKey) return
  
    const key = event.key.toLowerCase()

    switch(key) {
      case 't': return mode.set('translate')
      case 'r': return mode.set('rotate')
      case 's': return mode.set('scale')
    }
  }

  const keyup = (_event: KeyboardEvent) => {
    
  }

  let controls: TransformControlsType

  // Prevent controls from being shown in the Treeview
  $: if (controls) {
    $scene.remove(controls)
    add.call($scene, controls)
  }
</script>

<svelte:window
  on:keydown={keydown}
  on:keyup={keyup}
/>

<TransformControls
  bind:controls
  {object}
  mode={$mode}
  autoPauseOrbitControls
  on:mouseDown={() => usingTransformControls.set(true)}
  on:mouseUp={() => usingTransformControls.set(false)}
/>