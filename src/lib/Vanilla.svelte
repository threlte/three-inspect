<script lang='ts'>
  import type * as THREE from 'three'
  import { Canvas } from '@threlte/core'
  import Threlte from './Threlte.svelte'

  export let position: 'draggable' | 'fixed' | 'inline' = 'draggable'
  export let scene: undefined | THREE.Scene = undefined
  export let camera: undefined | THREE.PerspectiveCamera | THREE.OrthographicCamera = undefined
  export let renderer: undefined | THREE.WebGLRenderer = undefined

</script>

<Canvas renderMode='manual' size={{ width: 0, height: 0 }}>
  <Threlte {position} {scene} {camera} {renderer} />
</Canvas>
