<script lang='ts'>
  import { useBinding, useSeparator } from '$lib/components/tweakpane'

  export let object: THREE.FogBase

  useSeparator()
  useBinding({ label: 'color', object })
  useBinding({ label: 'near', object })
  useBinding({ label: 'far', object })
</script>
