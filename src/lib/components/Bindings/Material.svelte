<script lang='ts'>
  import * as THREE from 'three'
  import { Binding, Folder, List } from 'svelte-tweakpane-ui'
  import Color from './Color.svelte'
  import Textures from './Textures.svelte'
  
  export let object: THREE.Material

  const options = {
    onChange() { object.needsUpdate = true }
  }

  $: console.log(object.opacity)
</script>

<Binding bind:object key='visible' label='visible' />

<Binding bind:object key='transparent' label='transparent' {options} />

<Binding bind:object key='opacity' label='opacity' options={{ min: 0, max: 1, ...options }} />

{#if 'color' in object}
  <Color label='color' {object} />
{/if}

{#if 'emissive' in object}
  <Binding bind:object key='emissive' label='emissive' />
{/if}

{#if 'emissiveIntensity' in object}
  <Binding bind:object key='emissiveIntensity' label='emissiveIntensity' options={{ min: 0 }} />
{/if}

{#if 'reflectivity' in object}
  <Binding bind:object key='reflectivity' label='reflectivity' options={{ min: 0, max: 1 }} />
{/if}

{#if 'refractionRatio' in object}
  <Binding bind:object key='refractionRatio' label='refractionRatio' options={{ min: 0, max: 1 }} />
{/if}

{#if 'shininess' in object}
  <Binding bind:object key='shininess' label='shininess' options={{ min: 0, max: 1 }} />
{/if}

{#if object instanceof THREE.MeshStandardMaterial}
  <Binding bind:object key='roughness' label='roughness' options={{ min: 0, max: 1 }} />
  <Binding bind:object key='metalness' label='metalness' options={{ min: 0, max: 1 }} />
{/if}

{#if object instanceof THREE.MeshPhysicalMaterial}
  <Binding bind:object key='clearcoat' label='clearcoat' options={{ min: 0, max: 1 }} />
  <Binding bind:object key='clearcoatRoughness' label='clearcoatRoughness' options={{ min: 0, max: 1 }} />
  <Binding bind:object key='transmission' label='transmission' options={{ min: 0, max: 1 }} />
  <Binding bind:object key='ior' label='ior' options={{ min: 0, max: 1 }} />
  <Binding bind:object key='reflectivity' label='reflectivity' options={{ min: 0, max: 1 }} />
  <Binding bind:object key='sheen' label='sheen' options={{ min: 0, max: 1 }} />
  <Binding bind:object key='sheenRoughness' label='sheenRoughness' options={{ min: 0, max: 1 }} />
  <Color key='attenuationColor' label='attenuationColor' {object} />
  <Color key='sheenColor' label='sheenColor' {object} />
{/if}

<Folder title='textures' expanded={false}>
  <Textures {object} />
</Folder>

<Binding bind:object key='alphaHash' label='alphaHash' />
<Binding bind:object key='alphaTest' label='alphaTest' />
<Binding bind:object key='alphaToCoverage' label='alphaToCoverage' />

<Folder title='blending' expanded={false}>
  <Binding bind:object key='blendAlpha' label='blendAlpha' />
  <Color key='blendColor' label='blendColor' {object} />
  <Binding bind:object key='blendDst' label='blendDst' />

  {#if object.blendDstAlpha}
    <Binding bind:object key='blendDstAlpha' label='blendDstAlpha' />
  {/if}

  {#if object.blendEquationAlpha}
    <Binding bind:object key='blendEquationAlpha' label='blendEquationAlpha' />
  {/if}

  <Binding bind:object key='blending' label='blending' />
  <Binding bind:object key='blendSrc' label='blendSrc' />
  
  {#if object.blendSrcAlpha}
    <Binding bind:object key='blendSrcAlpha' label='blendSrcAlpha' />
  {/if}
</Folder>

<Binding bind:object key='clipIntersection' label='clipIntersection' />
<Binding bind:object key='clipShadows' label='clipShadows' />
<Binding bind:object key='colorWrite' label='colorWrite' />

{#if 'combine' in object}
  <List bind:value={object.combine} label="combine" options={{
    MultiplyOperation: THREE.MultiplyOperation,
    MixOperation: THREE.MixOperation,
    AddOperation: THREE.AddOperation,
  }} />
{/if}

<Folder title='depth' expanded={false}>
  <Binding bind:object key='depthFunc' label='depthFunc' />
  <Binding bind:object key='depthTest' label='depthTest' />
  <Binding bind:object key='depthWrite' label='depthWrite' />
  <Binding bind:object key='forceSinglePass' label='forceSinglePass' />  
</Folder>

<Folder title='stencil' expanded={false}>
  <Binding bind:object key='stencilWrite' label='stencilWrite' />
  <Binding bind:object key='stencilWriteMask' label='stencilWriteMask' />
  <Binding bind:object key='stencilFunc' label='stencilFunc' />
  <Binding bind:object key='stencilRef' label='stencilRef' />
  <Binding bind:object key='stencilFuncMask' label='stencilFuncMask' />
  <Binding bind:object key='stencilFail' label='stencilFail' />
  <Binding bind:object key='stencilZFail' label='stencilZFail' />
  <Binding bind:object key='stencilZPass' label='stencilZPass' />
</Folder>

<Binding bind:object key='polygonOffset' label='polygonOffset' />
<Binding bind:object key='polygonOffsetFactor' label='polygonOffsetFactor' />
<Binding bind:object key='polygonOffsetUnits' label='polygonOffsetUnits' />
<Binding bind:object key='premultipliedAlpha' label='premultipliedAlpha' />
<Binding bind:object key='dithering' label='dithering' />

<List bind:value={object.side} label="side" options={{
  FrontSide: THREE.FrontSide,
  BackSide: THREE.BackSide,
  DoubleSide: THREE.DoubleSide,
}} />

<List bind:value={object.shadowSide} label="shadowSide" options={{
  FrontSide: THREE.FrontSide,
  BackSide: THREE.BackSide,
  DoubleSide: THREE.DoubleSide,
}} />

<Binding bind:object key='toneMapped' label='toneMapped' />

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

<Binding bind:object key='vertexColors' label='vertexColors' />
