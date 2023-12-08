<script lang='ts'>
  import { ThreePerf } from 'three-perf'
  import { getInternalContext } from '../../internal/context'
  import { useUpdate } from '../../hooks/useUpdate'
  import { onMount } from 'svelte';
  
  const { renderer } = getInternalContext()



  onMount(() => {
    const perf = new ThreePerf({
      anchorX: 'left',
      anchorY: 'top',
      domElement: document.body, // or other canvas rendering wrapper
      renderer: $renderer // three js renderer instance you use for rendering
  })
  })

  useUpdate(() => {
    perf.end()
    perf.begin()
  })

  function () {

      perf.begin();

      // supports composer or multy-pass rendering
      renderer.render( scene, camera );

      perf.end();

  }
</script>