<script lang='ts'>
  import { useBinding } from '$lib/components/tweakpane'

  export let object: THREE.Material

  useBinding({ label: 'fog', object })
</script>
