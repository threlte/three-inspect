<script lang='ts'>
  import { T } from '@threlte/core'
  import { useBinding } from '$lib/components/tweakpane'

  export let object: THREE.SpotLight

  const onChange = () => object.target.updateMatrixWorld()

  useBinding({ label: 'angle', object, params: { min: 0, max: Math.PI / 2 } })
  useBinding({ label: 'decay', object })
  useBinding({ label: 'distance', object })
  useBinding({ label: 'penumbra', object, params: { min: 0, max: 1 } })
  useBinding({ label: 'power', object })
  useBinding({ label: 'position', object, onChange })
</script>

<T.SpotLightHelper
  args={[object]}
  userData.threeInspectHide
/>
