<script lang="ts">
  import { Binding, Image, Separator } from 'svelte-tweakpane-ui'
  import * as THREE from 'three'
  import Color from './Color.svelte'

  export let object: THREE.Scene

  $: fog = object.fog as THREE.Fog
</script>

{#if object.background}
  <Separator />

  <Binding
    bind:object
    key="backgroundBlurriness"
    label="backgroundBlurriness"
  />
  <Binding
    bind:object
    key="backgroundIntensity"
    label="backgroundIntensity"
  />

  {#if 'isColor' in object.background}
    <Color
      key="background"
      label="background"
      {object}
    />
  {:else if object.background instanceof THREE.Texture}
    <Image
      bind:value={object.background.image.src}
      fit="cover"
      label="background"
    />
  {/if}

  {#if object.environment}
    <Image
      bind:value={object.environment.image.src}
      fit="cover"
      label="environment"
    />
  {/if}
{/if}

{#if fog}
  <Separator />

  <Binding
    bind:object={fog}
    key="color"
    label="color"
  />
  <Binding
    bind:object={fog}
    key="near"
    label="near"
  />
  <Binding
    bind:object={fog}
    key="far"
    label="far"
  />
{/if}
