<script lang='ts'>
  import * as THREE from 'three'
  import { useBinding } from '$lib/components/tweakpane'
  // import { useDocs } from '$lib/hooks/docs'
  import Emissive from './Emissive.svelte'
  import Reflectivity from './Reflectivity.svelte'
  import Standard from './Standard.svelte'
  import Physical from './Physical.svelte'
  import Misc from './Misc/Misc.svelte'
  import Color from '../color.svelte'
  
  export let object: THREE.Material
  
  // const matdocs = useDocs('materials', 'Material')
  // const docs = useDocs('materials', object.type)
  // const matlink = (key: string) => matdocs(key)
  // const link = (key: string) => docs(key)

  useBinding({ label: 'visible', object })
  useBinding({ label: 'transparent', object, onChange() { object.needsUpdate = true } })
  useBinding({ label: 'opacity', object, params: { min: 0, max: 1 } })
</script>

<Color label='color' {object} />

{#if
  object instanceof THREE.MeshLambertMaterial ||
  object instanceof THREE.MeshPhongMaterial ||
  object instanceof THREE.MeshStandardMaterial
}
  <Emissive {object} />
{/if}

{#if
  object instanceof THREE.MeshBasicMaterial ||
  object instanceof THREE.MeshLambertMaterial ||
  object instanceof THREE.MeshPhongMaterial
}
  <Reflectivity {object} />
{:else if object instanceof THREE.MeshStandardMaterial}
  <Standard {object} />

  {#if object instanceof THREE.MeshPhysicalMaterial}
    <Physical {object} />
  {/if}
{/if}

<Misc {object} />
