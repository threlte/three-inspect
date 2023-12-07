<script lang='ts'>
  import * as THREE from 'three'
  import { Slider, Point } from 'svelte-tweakpane-ui'

  export let object: THREE.InstancedMesh

  let instance = 0

  const matrix4 = new THREE.Matrix4()
  const quat = new THREE.Quaternion()
  let position = new THREE.Vector3()
  let rotation = new THREE.Euler()
  let scale = new THREE.Vector3()

  $: {
    object.getMatrixAt(instance, matrix4)
    matrix4.decompose(position, quat, scale)
    rotation.setFromQuaternion(quat)
    object.instanceMatrix.needsUpdate = true
  }
</script>

<Slider bind:value={instance} label='instance' min={0} max={1} step={1} />
<Point bind:value={position} label='position' />
<Point bind:value={rotation} label='rotation' />
<Point bind:value={scale} label='scale' />
