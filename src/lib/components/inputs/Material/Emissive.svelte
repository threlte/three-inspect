<script lang='ts'>
  import { useBinding } from '$lib/components/tweakpane'

  export let object: THREE.Material

  useBinding({ label: 'emissive', object })
  useBinding({ label: 'emissiveIntensity', object, params: { min: 0 } })
</script>
