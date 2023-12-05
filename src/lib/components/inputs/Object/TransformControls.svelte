<script lang='ts'>
  import { TransformControls } from '@threlte/extras'
  import { useInteracting } from '$lib/hooks/use-interacting'

  export let object: THREE.Object3D

  const interacting = useInteracting()

  let enableControls = true

  const keydown = (event: KeyboardEvent) => {

  }

  const keyup = (event: KeyboardEvent) => {
    
  }
</script>

<svelte:window
  on:keydown={keydown}
  on:keyup={keyup}
/>

{#if enableControls}
  <TransformControls
    {object}
    name='Three Inspect Transform Controls'
    userData.threeInspectHide
    autoPauseOrbitControls
    on:create={({ ref, cleanup }) => {
      ref.addEventListener('mouseDown', () => ($interacting = true))
      ref.addEventListener('mouseUp', () => ($interacting = false))

      cleanup(() => {
        ref.removeEventListener('mouseDown', () => ($interacting = true))
        ref.removeEventListener('mouseUp', () => ($interacting = false))
      })
    }}
  />
{/if}
