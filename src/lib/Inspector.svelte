<script lang='ts'>
  import App from './components/App.svelte'
  import { persisted } from './internal/persisted'
  import { setInternalContext } from './internal/context'

  export let scene: THREE.Scene
  export let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
  export let renderer: THREE.WebGLRenderer

  let enabled = persisted('three-inspect.enabled', true)

  const handleKeyup = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === 'i') {
      $enabled = !$enabled
    }
  }

  setInternalContext({ scene, camera, renderer })
</script>

<svelte:window on:keyup={handleKeyup} />

{#if $enabled}
  <App>
    <slot />
  </App>
{/if}
