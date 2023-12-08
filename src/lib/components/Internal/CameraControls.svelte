<script context='module' lang='ts'>
  import * as THREE from 'three'
  import CameraControls from 'camera-controls'

  CameraControls.install({ THREE })
</script>

<script lang='ts'>
  import { useTask, watch } from '@threlte/core'
  import { onMount } from 'svelte'
  import { getInternalContext } from '../../internal/context'

  export let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera

  const { usingTransformControls, renderer } = getInternalContext()
  const clock = new THREE.Clock()

  const { start } = useTask(() => {
    const delta = clock.getDelta()
    cameraControls!.update(delta)
  }, { autoStart: false })

  let cameraControls = new CameraControls(camera, $renderer.domElement)

  watch(usingTransformControls, (value) => {
    cameraControls.enabled = !value
  })

  onMount(() => {
    start()
    return () => cameraControls?.dispose()
  })
</script>
