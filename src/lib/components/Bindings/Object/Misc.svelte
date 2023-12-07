<script lang='ts'>
  import { Binding, Separator, Textarea } from 'svelte-tweakpane-ui'

  export let object: THREE.Object3D

  $: userData = JSON.stringify(object.userData)
</script>

<Binding bind:object key='frustumCulled' label='frustumCulled' />
<Binding bind:object key='matrixAutoUpdate' label='matrixAutoUpdate' />
<Binding bind:object key='matrixWorldAutoUpdate' label='matrixWorldAutoUpdate' />
<Binding bind:object key='renderOrder' label='renderOrder' options={{ step: 1 }} />
<Separator />
<Textarea bind:value={userData} label='userData' disabled rows={5} />