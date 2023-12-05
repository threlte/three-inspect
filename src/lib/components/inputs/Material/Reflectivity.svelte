<script lang='ts'>
  import { useBinding } from '$lib/components/tweakpane'

  export let object: THREE.Material

  useBinding({ label: 'reflectivity', object, params: { min: 0, max: 1 } })
  useBinding({ label: 'refractionRatio', object, params: { min: 0, max: 1 } })
  useBinding({ label: 'shininess', object, params: { min: 0, max: 1 } })
</script>
