<script lang='ts'>
  import { useBinding } from '$lib/components/tweakpane';
  import * as THREE from 'three'

  export let object: THREE.InstancedMesh

  const matrix4 = new THREE.Matrix4()
  const quat = new THREE.Quaternion()
  const params = {
    instance: 0,
    position: new THREE.Vector3(),
    rotation: new THREE.Euler(),
    scale: new THREE.Vector3(),
  }
  
  const updateInstance = () => {
    object.getMatrixAt(params.instance, matrix4)
    matrix4.decompose(params.position, quat, params.scale)
    params.rotation.setFromQuaternion(quat)
  }
  
  useBinding({ label: 'instance', params, onChange: updateInstance })
  useBinding({ label: 'position', params })
  useBinding({ label: 'rotation', params })
  useBinding({ label: 'scale', params })
</script>
