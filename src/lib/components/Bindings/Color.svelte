<script lang="ts">
  import type * as THREE from 'three'
  import SerializedBinding from './SerializedBinding.svelte'

  export let label = 'color'
  export let key = 'color'
  export let object: THREE.Object3D | THREE.Material

  const options = {
    color: { type: 'float' },
  }

  // @todo add type safety
  $: k = key as keyof object
</script>

<SerializedBinding
  bind:object
  key={k}
  {label}
  {options}
/>
