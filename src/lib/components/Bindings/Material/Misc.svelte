<script lang='ts'>
  import { Binding, Separator } from 'svelte-tweakpane-ui'

  const options = { onChange() { object.needsUpdate = true } }

  export let object: THREE.Material
</script>

<Separator />

<Binding bind:object key='vertexColors' label='vertexColors' />

{#if 'flatShading' in object}
  <Binding bind:object key='flatShading' label='flatShading' {options} />
{/if}

{#if 'wireframe' in object}
  <Binding bind:object key='wireframe' label='wireframe' />
{/if}

{#if 'fog' in object}
  <Binding bind:object key='fog' label='fog' />
{/if}

{#if 'size' in object && 'sizeAttenuation' in object}
  <Binding bind:object key='size' label='size' />
  <Binding bind:object key='sizeAttenuation' label='sizeAttenuation' />
{/if}

<!-- <RadioGrid
  key='side'
  {object}
  options={[
    ['Back', THREE.BackSide],
    ['Double', THREE.DoubleSide],
    ['Front', THREE.FrontSide],
  ]}
/> -->
