<script lang='ts'>
  import { useBinding } from '$lib/components/tweakpane'

  export let object: THREE.Material

  useBinding({ label: 'size', object })
  useBinding({ label: 'sizeAttenuation', object })
</script>
