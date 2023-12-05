<script lang='ts'>
  import * as THREE from 'three'
  import Object3D from '../Object/Object.svelte'
  import { useDocs } from '$lib/hooks/docs'
  import Perspective from './Perspective.svelte'
  import Orthographic from './Orthographic.svelte'

  export let object: THREE.PerspectiveCamera | THREE.OrthographicCamera
  export let enableControls = true

  const link = (key: string) => docs(key)

  $: docs = useDocs('cameras', object.type)
</script>

<Object3D {object} {enableControls} />

{#if object instanceof THREE.PerspectiveCamera}
  <Perspective {object} />
{:else if object instanceof THREE.OrthographicCamera}
  <Orthographic {object} />
{/if}
