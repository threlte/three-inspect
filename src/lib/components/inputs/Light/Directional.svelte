<script lang='ts'>
  import { T } from '@threlte/core'
  import { useBinding } from '$lib/components/tweakpane'

  export let object: THREE.DirectionalLight

  const onChange = () => object.target.updateMatrixWorld()

  useBinding({ label: 'position', object, onChange })
</script>

<T.DirectionalLightHelper
  args={[object, 10]}
  userData.threeInspectHide
/>
