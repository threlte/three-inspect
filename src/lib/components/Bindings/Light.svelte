<script lang="ts">
  import { Folder } from 'svelte-tweakpane-ui'
  import * as THREE from 'three'
  import Color from './Color.svelte'
  import SerializedBinding from './SerializedBinding.svelte'
  import Shadow from './Shadow.svelte'

  export let object:
    | THREE.DirectionalLight
    | THREE.PointLight
    | THREE.SpotLight
    | THREE.HemisphereLight
    | THREE.RectAreaLight
</script>

<Color
  key="color"
  {object}
/>

<SerializedBinding
  bind:object
  key="intensity"
  label="intensity"
  options={{ step: 0.05 }}
/>

{#if 'isDirectionalLight' in object}
  <SerializedBinding
    bind:object={object.target}
    key="position"
    label="target"
  />
{:else if 'isPointLight' in object}
  <SerializedBinding
    bind:object
    key="decay"
    label="decay"
  />
  <SerializedBinding
    bind:object
    key="distance"
    label="distance"
  />
  <SerializedBinding
    bind:object
    key="power"
    label="power"
  />
{:else if 'isSpotLight' in object}
  <SerializedBinding
    bind:object={object.target}
    key="position"
    label="target"
  />
  <SerializedBinding
    bind:object
    key="angle"
    label="angle"
    options={{ min: 0, max: Math.PI / 2 }}
  />
  <SerializedBinding
    bind:object
    key="decay"
    label="decay"
  />
  <SerializedBinding
    bind:object
    key="distance"
    label="distance"
  />
  <SerializedBinding
    bind:object
    key="penumbra"
    label="penumbra"
    options={{ min: 0, max: 1 }}
  />
  <SerializedBinding
    bind:object
    key="power"
    label="power"
  />
  <SerializedBinding
    bind:object
    key="position"
    label="position"
  />
{:else if 'isHemisphereLight' in object}
  <SerializedBinding
    bind:object
    key="groundColor"
    label="groundColor"
  />
{:else if 'isRectAreaLight' in object}
  <SerializedBinding
    bind:object
    key="power"
    label="power"
  />
  <SerializedBinding
    bind:object
    key="width"
    label="width"
  />
  <SerializedBinding
    bind:object
    key="height"
    label="height"
  />
{/if}

{#if object.shadow && object.castShadow}
  <Folder
    expanded={false}
    title="shadow"
  >
    <Shadow object={object.shadow} />
  </Folder>
{/if}

<!-- @TODO: target and transform controls -->
