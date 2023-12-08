<script lang='ts'>
  import type * as THREE from 'three'
  import { useThrelte, type CurrentWritable } from '@threlte/core'
  import Inspector from './Inspector.svelte'

  export let scene: undefined | THREE.Scene = undefined
  export let camera: undefined | THREE.PerspectiveCamera | THREE.OrthographicCamera = undefined
  export let renderer: undefined | THREE.WebGLRenderer = undefined

  const context = useThrelte()

  $: cam = context.camera as CurrentWritable<THREE.PerspectiveCamera | THREE.OrthographicCamera>
</script>

<Inspector
  scene={scene ?? context.scene}
  renderer={renderer ?? context.renderer}
  camera={camera ?? $cam}
>
  <slot />
</Inspector>
