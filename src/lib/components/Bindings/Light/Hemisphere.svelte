<script lang='ts'>
  import { T } from '@threlte/core'
  import { Binding } from 'svelte-tweakpane-ui'

  export let object: THREE.HemisphereLight
</script>

<Binding bind:object key='groundColor' label='groundColor'/>

<T.HemisphereLightHelper
  args={[object, 10]}
/>
