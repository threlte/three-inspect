<script lang='ts'>
  import * as THREE from 'three'
  import { Binding, Textarea, Folder } from 'svelte-tweakpane-ui'
  import Transform from './Transform/Transform.svelte'
  import Camera from './Camera.svelte'
  import Light from './Light.svelte'
  import Scene from './Scene.svelte'
  import Material from './Material.svelte'

  export let object: THREE.Object3D

  $: mesh = object as THREE.Mesh
  $: scene = object as THREE.Scene
  $: light = object as THREE.Light 
  $: camera = object as THREE.PerspectiveCamera | THREE.OrthographicCamera
  $: userData = JSON.stringify(object.userData)
</script>

<Binding bind:object key='visible' label='visible' />

{#if ('isAmbientLight' in object) === false}
  <Transform {object} />
{/if}

{#if mesh.isMesh || 'isPointLight' in object || 'isSpotLight' in object || 'isDirectionalLight' in object}
  <Binding bind:object key='castShadow' label='castShadow' />
{/if}

{#if mesh.isMesh}
  <Binding bind:object key='receiveShadow' label='receiveShadow' />
{/if}

<Binding bind:object key='frustumCulled' label='frustumCulled' />
<Binding bind:object key='matrixAutoUpdate' label='matrixAutoUpdate' />
<Binding bind:object key='matrixWorldAutoUpdate' label='matrixWorldAutoUpdate' />
<Binding bind:object key='renderOrder' label='renderOrder' options={{ step: 1 }} />

{#if 'isPerspectiveCamera' in camera || 'isOrthographicCamera' in camera}
  <Folder title="Camera" expanded={false}>
    <Camera object={camera} />
  </Folder>

{:else if light.isLight}
  <Folder title="Light" expanded={false}>
    <Light object={light} />
  </Folder>

{:else if 'material' in object && object.material instanceof THREE.Material}
  <Folder title="Material" expanded={false}>
    <Material object={object.material} />
  </Folder>

{:else if scene.isScene}
  <Folder title="Material" expanded={false}>
    <Scene object={scene} />
  </Folder>
{/if}

<Folder title='userData' expanded={false}>
  <Textarea bind:value={userData} disabled rows={5} />
</Folder>
