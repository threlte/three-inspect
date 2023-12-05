<script lang='ts'>
  import { T } from '@threlte/core'
  import { useBinding } from '$lib/components/tweakpane'

  export let object: THREE.Light

  useBinding({ label: 'decay', object })
  useBinding({ label: 'distance', object })
  useBinding({ label: 'power', object })
</script>

<T.PointLightHelper
  args={[object, 10]}
  userData.threeInspectHide
/>
