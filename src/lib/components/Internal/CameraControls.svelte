<script lang='ts'>
  import * as THREE from 'three'
  import CameraControls from 'camera-controls'
  import { useTask, watch } from '@threlte/core'
  import { onMount } from 'svelte'
  import { getInternalContext } from '../../internal/context'

  CameraControls.install({ THREE })

  const { camera, usingTransformControls } = getInternalContext()
  const clock = new THREE.Clock()

  const { start } = useTask(() => {
    const delta = clock.getDelta()
    const hasControlsUpdated = cameraControls!.update(delta)

    // you can skip this condition to render though
    if (hasControlsUpdated) {
      // todo
    }
  }, { autoStart: false })

  let cameraControls: CameraControls | undefined

  watch(usingTransformControls, (value) => {
    if (cameraControls) cameraControls.enabled = !value
  })

  onMount(() => {
    const parent = document.querySelectorAll('.splitpanes__pane')[0] as HTMLElement
    cameraControls = new CameraControls($camera as THREE.PerspectiveCamera | THREE.OrthographicCamera, parent)
    start()
  })
</script>
