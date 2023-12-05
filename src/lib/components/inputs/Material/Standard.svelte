<script lang='ts'>
  import { useBinding } from '$lib/components/tweakpane'

  export let object: THREE.Material

  useBinding({ label: 'roughness', object, params: { min: 0, max: 1 } })
  useBinding({ label: 'metalness', object, params: { min: 0, max: 1 } })
</script>
