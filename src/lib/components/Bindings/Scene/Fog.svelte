<script lang='ts'>
  import { Binding, Separator } from 'svelte-tweakpane-ui'

  export let object: THREE.Fog
</script>

<Separator />
<Binding bind:object key='color' label='color' />
<Binding bind:object key='near' label='near' />
<Binding bind:object key='far' label='far' />
