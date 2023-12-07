<script lang='ts'>
  import { Binding } from 'svelte-tweakpane-ui'

  export let label = 'color'
  export let key = 'color'
  export let object: THREE.Light | Record<'color', unknown>

  const options = {
    color: { type: 'float' },
    onChange() {
      console.log('hi', object[key])
    }
  }
</script>

<Binding
  bind:object
  {key}
  {label}
  {options}
/>
