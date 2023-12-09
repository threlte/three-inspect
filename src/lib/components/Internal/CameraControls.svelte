<script context='module' lang='ts'>
  import * as THREE from 'three'
  import CameraControls from 'camera-controls'

  CameraControls.install({ THREE })
</script>

<script lang='ts'>
  import { useTask, useThrelte } from '@threlte/core'
  import { getInternalContext } from '../../internal/context'

  export let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera

  const { renderer } = useThrelte()
  const { usingTransformControls } = getInternalContext()
  const clock = new THREE.Clock()
  const cameraControls = new CameraControls(camera, renderer.domElement)

  useTask(() => {
    const delta = clock.getDelta()
    cameraControls.update(delta)
  })

  $: cameraControls.enabled = !$usingTransformControls
</script>
