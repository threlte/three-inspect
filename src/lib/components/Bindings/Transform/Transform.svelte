<script lang='ts'>
  import { useTask } from '@threlte/core'
  import { Binding, Separator, type BindingRef } from 'svelte-tweakpane-ui'
  import Instance from './Instance.svelte'

  export let object: THREE.Object3D
  
  let refs: BindingRef[] = []

  useTask(() => {
    refs.forEach(ref => ref.refresh())
  })

  $: instancedMesh = object as THREE.InstancedMesh
</script>

<Binding bind:ref={refs[0]} bind:object key='position' label='position' />
<Binding bind:ref={refs[1]} bind:object key='rotation' label='rotation' />
<Binding bind:ref={refs[2]} bind:object key='scale' label='scale' />

{#if 'isInstancedMesh' in instancedMesh}
  <Separator />
  <Instance object={instancedMesh} />
{/if}
