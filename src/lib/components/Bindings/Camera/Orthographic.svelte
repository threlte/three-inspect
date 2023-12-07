
<script lang='ts'>
  import { T } from '@threlte/core'
  import { Binding } from 'svelte-tweakpane-ui'

  export let object: THREE.OrthographicCamera

  let ref: THREE.CameraHelper

  const options = {
    onChange() {
      object.updateProjectionMatrix()
      ref.update()
    }
  }
</script>

<Binding bind:object key='bottom' label='bottom' {options} />
<Binding bind:object key='left' label='left' {options} />
<Binding bind:object key='right' label='right' {options} />
<Binding bind:object key='top' label='top' {options} />

<T.CameraHelper
  bind:ref
  args={[object]}
  userData.threeInspectHide
/>
