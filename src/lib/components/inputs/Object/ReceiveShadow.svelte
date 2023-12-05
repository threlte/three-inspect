<script lang='ts'>
  import { useBinding } from '$lib/components/tweakpane'

  export let object: THREE.Object3D
  
  useBinding({ label: 'receiveShadow', object })
</script>
