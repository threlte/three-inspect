<script context='module' lang='ts'>
  import * as THREE from 'three'
  import CameraControls from 'camera-controls'

  CameraControls.install({ THREE })
</script>

<script lang='ts'>
  import { getInternalContext } from '../../internal/context'
  import { useUpdate } from '$lib/hooks/useUpdate';

  export let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera

  const { usingTransformControls, renderer } = getInternalContext()
  const clock = new THREE.Clock()
  const cameraControls = new CameraControls(camera, $renderer.domElement)

  useUpdate(() => {
    const delta = clock.getDelta()
    cameraControls.update(delta)
  })

  cameraControls.enabled = $usingTransformControls === false
</script>
