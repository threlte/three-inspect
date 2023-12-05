<script lang='ts'>
  import { T } from '@threlte/core'
  import { useBinding } from '$lib/components/tweakpane'
  import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'

  export let object: THREE.RectAreaLight

  useBinding({ label: 'power', object })
  useBinding({ label: 'width', object })
  useBinding({ label: 'height', object })
</script>

<T
  is={RectAreaLightHelper}
  args={[object]}
  userData.threeInspectHide
/>
