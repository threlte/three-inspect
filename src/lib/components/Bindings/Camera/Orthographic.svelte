
<script lang='ts'>
  import { T } from '@threlte/core'
  import { Binding } from 'svelte-tweakpane-ui'
  import { getInternalContext } from '$lib/internal/context'

  export let object: THREE.OrthographicCamera

  const { usingFreeCamera } = getInternalContext()

  let ref: THREE.CameraHelper | undefined

  const options = {
    onChange() {
      object.updateProjectionMatrix()
      ref?.update()
    }
  }
</script>

<Binding bind:object key='bottom' label='bottom' {options} />
<Binding bind:object key='left' label='left' {options} />
<Binding bind:object key='right' label='right' {options} />
<Binding bind:object key='top' label='top' {options} />

{#if $usingFreeCamera}
  <T.CameraHelper bind:ref args={[object]} />
{/if}
