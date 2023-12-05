<script lang='ts'>

import * as THREE from 'three'
import CameraControls from 'camera-controls'
import { useFrame, watch } from '@threlte/core'
import { onMount } from 'svelte'
import { useInteracting } from '$lib/hooks/use-interacting'
import { getInspectorContext } from './context'

CameraControls.install({ THREE })

const { camera } = getInspectorContext()
const interacting = useInteracting()
const clock = new THREE.Clock()

const { start } = useFrame(() => {
  const delta = clock.getDelta()
	const hasControlsUpdated = cameraControls.update(delta)

	// you can skip this condition to render though
	if ( hasControlsUpdated ) {
    // todo
	}
}, { autostart: false })

let cameraControls: CameraControls | undefined

watch(interacting, (value) => {
  if (cameraControls) cameraControls.enabled = !value
})

onMount(() => {
  const parent = document.querySelectorAll('.splitpanes__pane')[0] as HTMLElement
  cameraControls = new CameraControls($camera as THREE.PerspectiveCamera | THREE.OrthographicCamera, parent)
  start()
})

</script>

