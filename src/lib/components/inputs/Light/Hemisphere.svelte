<script lang='ts'>
  import { T } from '@threlte/core'
  import { useBinding } from '$lib/components/tweakpane'

  export let object: THREE.Light

  useBinding({ label: 'groundColor', object })
</script>

<T.HemisphereLightHelper
  args={[object, 10]}
  userData.threeInspectHide
/>
