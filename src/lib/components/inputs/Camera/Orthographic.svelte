
<script lang='ts'>
  import { T } from '@threlte/core'
  import { useBinding } from '$lib/components/tweakpane'

  export let object: THREE.OrthographicCamera

  let ref: THREE.CameraHelper

  const onChange = () => {
    object.updateProjectionMatrix()
    ref.update()
  }

  useBinding({ label: 'near', object, onChange })
  useBinding({ label: 'far', object, onChange })
  useBinding({ label: 'zoom', object, onChange })
  useBinding({ label: 'bottom', object, onChange })
  useBinding({ label: 'left', object, onChange })
  useBinding({ label: 'right', object, onChange })
  useBinding({ label: 'top', object, onChange })
</script>

<T.CameraHelper
  bind:ref
  args={[object]}
  userData.threeInspectHide
/>
