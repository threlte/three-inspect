<script lang='ts'>
  import { T } from '@threlte/core'
  import { Binding } from 'svelte-tweakpane-ui'

  export let object: THREE.PointLight
</script>

<Binding bind:object key='decay' label='decay' />
<Binding bind:object key='distance' label='distance' />
<Binding bind:object key='power' label='power' />

<T.PointLightHelper
  args={[object, 10]}
/>
