<script lang='ts'>
  import { T } from '@threlte/core'
  import { Binding } from 'svelte-tweakpane-ui'
  import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'

  export let object: THREE.RectAreaLight
</script>

<Binding bind:object key='power' label='power' />
<Binding bind:object key='width' label='width' />
<Binding bind:object key='height' label='height' />

<T
  is={RectAreaLightHelper}
  args={[object]}
  userData.threeInspectHide
/>
