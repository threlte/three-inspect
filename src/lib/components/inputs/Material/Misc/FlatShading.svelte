<script lang='ts'>
  import { useBinding } from '$lib/components/tweakpane'

  export let object: THREE.Material

  const onChange = () => (object.needsUpdate = true)

  useBinding({ label: 'flatShading', object, onChange })
</script>
