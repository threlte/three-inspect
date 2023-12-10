<script lang='ts'>
  import type * as THREE from 'three'
  import { Canvas } from '@threlte/core'
  import Threlte from './Threlte.svelte'

  export let position: 'draggable' | 'fixed' | 'inline' = 'draggable'
  export let scene: THREE.Scene
  export let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
  export let renderer: THREE.WebGLRenderer

</script>

<Canvas renderMode='manual' size={{ width: 0, height: 0 }}>
  <Threlte {position} {scene} {camera} {renderer} />
</Canvas>
