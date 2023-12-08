
<script lang='ts'>
  import { T } from '@threlte/core'
  import { Binding } from 'svelte-tweakpane-ui'
  import { getInternalContext } from '$lib/internal/context'

  export let object: THREE.PerspectiveCamera

  const { usingFreeCamera } = getInternalContext()

  let ref: THREE.CameraHelper | undefined

  const options = {
    onChange() {
      object.updateProjectionMatrix()
      ref?.update()
    }
  }
</script>

<Binding bind:object key='fov' label='fov' {options} />
<Binding bind:object key='filmOffset' label='filmOffset' {options} />
<Binding bind:object key='filmGauge' label='filmGauge' {options} />

{#if $usingFreeCamera}
  <T.CameraHelper bind:ref args={[object]} />
{/if}
