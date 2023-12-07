<script lang='ts'>
  import { Binding } from 'svelte-tweakpane-ui'

  export let object: THREE.Material
</script>
  
<Binding bind:object key='map' label='map' />
