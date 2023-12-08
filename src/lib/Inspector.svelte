<script lang='ts'>
  import { createEventDispatcher } from 'svelte'
  import Inspector from './components/inspector.svelte'
  import { persisted } from './internal/persisted'
  import { setInspectorContext } from './context'

  export let scene: THREE.Scene
  export let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
  export let renderer: THREE.WebGLRenderer

  const dispatch = createEventDispatcher<{ toggle: boolean }>()

  let enabled = persisted('three-inspect.enabled', true)

  const handleKeyup = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === 'i') {
      $enabled = !$enabled
      dispatch('toggle', $enabled)
    }
  }

  setInspectorContext({ scene, camera, renderer })
</script>

<svelte:window on:keyup={handleKeyup} />

{#if $enabled}
  <Inspector />
{/if}
