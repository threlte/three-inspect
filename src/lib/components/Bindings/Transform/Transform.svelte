<script lang='ts'>
  import { useTask } from '@threlte/core'
  import { Binding, Separator, type BindingRef } from 'svelte-tweakpane-ui'
  import Instance from './Instance.svelte'

  export let object: THREE.Object3D
  
  let position: BindingRef
  let rotation: BindingRef
  let scale : BindingRef

  useTask(() => {
    position.refresh()
    rotation.refresh()
    scale.refresh()
  })

  $: instancedMesh = object as THREE.InstancedMesh
</script>

<Binding bind:ref={position} bind:object key='position' label='position' />
<Binding bind:ref={rotation} bind:object key='rotation' label='rotation' />
<Binding bind:ref={scale} bind:object key='scale' label='scale' />

{#if 'isInstancedMesh' in instancedMesh}
  <Separator />
  <Instance object={instancedMesh} />
{/if}
