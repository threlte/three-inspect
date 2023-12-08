<script lang='ts'>
  import { T } from '@threlte/core'
  import { Binding } from 'svelte-tweakpane-ui'

  export let object: THREE.DirectionalLight
</script>

<Binding bind:object={object.target} key='position' label='target' />

<T.DirectionalLightHelper
  args={[object, 10]}
/>
