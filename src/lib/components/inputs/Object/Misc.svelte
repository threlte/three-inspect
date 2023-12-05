<script lang='ts'>
  import { useBinding, useSeparator } from '$lib/components/tweakpane'

  export let object: THREE.Object3D

  useBinding({ label: 'frustumCulled', object })
  useBinding({ label: 'matrixAutoUpdate', object })
  useBinding({ label: 'matrixWorldAutoUpdate', object })
  useBinding({ label: 'renderOrder', object, params: { step: 1 } })
  useSeparator()
  // useBinding({ label: 'userData', object })
</script>
