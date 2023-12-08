<script lang='ts'>
  import App from './components/App.svelte'
  import { persisted } from './internal/persisted'
  import { setPublicContext, setInternalContext } from './internal/context'

  export let position: 'draggable' | 'fixed' | 'inline' = 'inline'
  export let scene: THREE.Scene
  export let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
  export let renderer: THREE.WebGLRenderer

  let enabled = persisted('enabled', true)

  setPublicContext({ position })
  setInternalContext({ scene, camera, renderer })

  const handleKeyup = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === 'i') {
      $enabled = !$enabled
    }
  }
</script>

<svelte:window on:keyup={handleKeyup} />

{#if $enabled}
  <App>
    <slot />
  </App>
{/if}
