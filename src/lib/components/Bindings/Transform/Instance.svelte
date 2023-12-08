<script lang='ts'>
  import * as THREE from 'three'
  import { Binding, Slider, type BindingRef } from 'svelte-tweakpane-ui'

  export let object: THREE.InstancedMesh

  const mat4 = new THREE.Matrix4()

  let instance = 0
  let lastInstance = -1
  let refs: BindingRef[] = []
  let dummy = new THREE.Object3D()

  $: if (instance !== lastInstance) {
    object.getMatrixAt(instance, mat4)
    mat4.decompose(dummy.position, dummy.quaternion, dummy.scale)
    refs.forEach(ref => ref.refresh())
    lastInstance = instance
  } else {
    mat4.compose(dummy.position, dummy.quaternion, dummy.scale)
    object.setMatrixAt(instance, mat4)
    object.instanceMatrix.needsUpdate = true
  }
</script>

<Slider bind:value={instance} label='instance' min={0} max={object.count} step={1} />
<Binding bind:object={dummy} bind:ref={refs[0]} key='position' label='position' />
<Binding bind:object={dummy} bind:ref={refs[1]} key='rotation' label='rotation' />
<Binding bind:object={dummy} bind:ref={refs[2]} key='scale' label='scale' />
