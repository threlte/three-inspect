<script lang='ts'>
  import { TransformControls } from '@threlte/extras'
  import { getInternalContext } from '../../../internal/context'

  export let object: THREE.Object3D

  const { usingTransformControls } = getInternalContext()

  let mode: 'translate' | 'rotate' | 'scale' = 'translate'

  const keydown = (_event: KeyboardEvent) => {

  }

  const keyup = (_event: KeyboardEvent) => {
    
  }
</script>

<svelte:window
  on:keydown={keydown}
  on:keyup={keyup}
/>

<TransformControls
  {object}
  {mode}
  userData.threeInspectHide
  autoPauseOrbitControls
  on:create={({ ref, cleanup }) => {
    ref.addEventListener('mouseDown', () => ($usingTransformControls = true))
    ref.addEventListener('mouseUp', () => ($usingTransformControls = false))

    cleanup(() => {
      ref.removeEventListener('mouseDown', () => ($usingTransformControls = true))
      ref.removeEventListener('mouseUp', () => ($usingTransformControls = false))
    })
  }}
/>
