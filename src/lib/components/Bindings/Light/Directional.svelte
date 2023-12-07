<script lang='ts'>
  import { T } from '@threlte/core'
  import { Binding } from 'svelte-tweakpane-ui'

  export let object: THREE.DirectionalLight

  const options = { onChange() { object.target.updateMatrixWorld() } }
</script>

<Binding bind:object key='position' label='position' {options} />

<T.DirectionalLightHelper
  args={[object, 10]}
  userData.threeInspectHide
/>
