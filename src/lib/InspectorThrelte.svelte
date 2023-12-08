<script lang='ts'>
  import type * as THREE from 'three'
  import { useThrelte } from '@threlte/core'
  import Inspector from './Inspector.svelte'

  const { scene, renderer, camera: cam } = useThrelte()

  $: camera = $cam as THREE.PerspectiveCamera | THREE.OrthographicCamera
</script>

<Inspector
  {scene}
  {renderer}
  {camera}
/>
