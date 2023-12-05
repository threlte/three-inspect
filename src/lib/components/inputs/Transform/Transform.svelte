<script lang='ts'>
  import * as THREE from 'three'
  import { useBinding, useSeparator } from '$lib/components/tweakpane'
  import { useDocs } from '$lib/hooks/docs'
  import Instance from './Instance.svelte';
  import { useFrame } from '@threlte/core';
  
  export let object: THREE.Object3D
  
  const docs = useDocs('core', 'Object3D')
  
  const link = (key: string) => docs(key)

  const { binding: positionBinding } = useBinding({ label: 'position', object, onClick() { link('position') } })
  const { binding: rotationBinding } = useBinding({ label: 'rotation', object, onClick() { link('rotation') } })
  const { binding: scaleBinding } = useBinding({ label: 'scale', object, onClick() { link('scale') } })
  useSeparator()

  useFrame(() => {
    positionBinding.refresh()
    rotationBinding.refresh()
    scaleBinding.refresh()
  })
</script>

{#if object instanceof THREE.InstancedMesh}
  <Instance {object} />
{/if}
