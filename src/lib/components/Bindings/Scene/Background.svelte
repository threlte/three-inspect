<script lang='ts'>
  import * as THREE from 'three'
  import { Binding, Separator, Image } from 'svelte-tweakpane-ui'
  import Color from '../Material/Color.svelte'

  export let object: THREE.Scene
</script>

<Separator />
<Binding bind:object key='backgroundBlurriness' label='backgroundBlurriness' />
<Binding bind:object key='backgroundIntensity' label='backgroundIntensity' />

{#if object.background instanceof THREE.Color}
  <Color key='background' label='background' {object} />
{:else if object.background instanceof THREE.Texture}
  <Image bind:value={object.background.image.src} fit="cover" label="background" />
{/if}

{#if object.environment}
  <Image bind:value={object.environment.image.src} fit="cover" label="environment" />
{/if}
