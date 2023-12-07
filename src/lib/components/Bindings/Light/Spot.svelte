<script lang='ts'>
  import { T } from '@threlte/core'
  import { Binding } from 'svelte-tweakpane-ui'

  export let object: THREE.SpotLight

  const options = { onChange() { object.target.updateMatrixWorld() } }
</script>

<Binding bind:object key='angle' label='angle' options={{ min: 0, max: Math.PI / 2 }} />
<Binding bind:object key='decay' label='decay' />
<Binding bind:object key='distance' label='distance' />
<Binding bind:object key='penumbra' label='penumbra' options={{ min: 0, max: 1 }} />
<Binding bind:object key='power' label='power' />
<Binding bind:object key='position' label='position' />

<T.SpotLightHelper
  args={[object]}
  userData.threeInspectHide
/>
