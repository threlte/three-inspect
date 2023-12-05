<script lang='ts'>
  import { useBinding, useSeparator } from '$lib/components/tweakpane'
  import Color from '../color.svelte'

  export let object: THREE.Material

  useSeparator()
  useBinding({ label: 'clearcoat', object, params: { min: 0, max: 1 } })
  useBinding({ label: 'clearcoatRoughness', object, params: { min: 0, max: 1 } })
  useBinding({ label: 'transmission', object, params: { min: 0, max: 1 } })
  useBinding({ label: 'ior', object, params: { min: 0, max: 2.333 } })
  useBinding({ label: 'reflectivity', object, params: { min: 0, max: 1 } })
  useBinding({ label: 'sheen', object, params: { min: 0, max: 1 } })
  useBinding({ label: 'sheenRoughness', object, params: { min: 0, max: 1 } })
</script>

<Color key='attenuationColor' {object} />
<Color key='sheenColor' {object} />
