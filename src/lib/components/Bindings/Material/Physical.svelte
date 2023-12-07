<script lang='ts'>
  import { Binding, Separator } from 'svelte-tweakpane-ui'
  import Color from './Color.svelte'

  export let object: THREE.MeshPhysicalMaterial
</script>

<Separator />

<Binding bind:object key='clearcoat' label='clearcoat' options={{ min: 0, max: 1 }} />
<Binding bind:object key='clearcoatRoughness' label='clearcoatRoughness' options={{ min: 0, max: 1 }} />
<Binding bind:object key='transmission' label='transmission' options={{ min: 0, max: 1 }} />
<Binding bind:object key='ior' label='ior' options={{ min: 0, max: 1 }} />
<Binding bind:object key='reflectivity' label='reflectivity' options={{ min: 0, max: 1 }} />
<Binding bind:object key='sheen' label='sheen' options={{ min: 0, max: 1 }} />
<Binding bind:object key='sheenRoughness' label='sheenRoughness' options={{ min: 0, max: 1 }} />

<Color key='attenuationColor' {object} />
<Color key='sheenColor' {object} />
