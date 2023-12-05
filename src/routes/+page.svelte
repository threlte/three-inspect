<script lang='ts'>

import { Canvas } from '@threlte/core'
import Scene from './scene.svelte'

</script>

<Canvas>
  <Scene />
</Canvas>

<style>
  :global(body) {
    height: 100vh;
    margin: 0;
  }
</style>
