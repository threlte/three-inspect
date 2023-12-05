
<script lang='ts'>
  import { T } from '@threlte/core'
  import { useBinding } from '$lib/components/tweakpane'

  export let object: THREE.PerspectiveCamera

  let ref: THREE.CameraHelper

  const onChange = () => {
    object.updateProjectionMatrix()
    ref.update()
  }

  useBinding({ label: 'near', object, onChange })
  useBinding({ label: 'far', object, onChange })
  useBinding({ label: 'zoom', object, onChange })
  useBinding({ label: 'fov', object })
  useBinding({ label: 'filmOffset', object })
  useBinding({ label: 'filmGauge', object })
</script>

<T.CameraHelper
  bind:ref
  args={[object]}
  userData.threeInspectHide
/>
