
<script lang='ts'>
  import { T } from '@threlte/core'
  import { Binding } from 'svelte-tweakpane-ui'

  export let object: THREE.PerspectiveCamera

  let ref: THREE.CameraHelper

  const options = {
    onChange() {
      object.updateProjectionMatrix()
      ref.update()
    }
  }
</script>

<Binding bind:object key='fov' label='fov' {options} />
<Binding bind:object key='filmOffset' label='filmOffset' {options} />
<Binding bind:object key='filmGauge' label='filmGauge' {options} />

<T.CameraHelper
  bind:ref
  args={[object]}
/>
