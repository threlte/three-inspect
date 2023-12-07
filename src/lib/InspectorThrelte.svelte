<script lang='ts'>
  import { useThrelte, currentWritable } from '@threlte/core'
  import Inspector from './Inspector.svelte'
  import { setInspectorContext } from './context'

  const threlte = useThrelte()
  const scene = currentWritable(threlte.scene)
  const camera = threlte.camera
  const renderer = currentWritable(threlte.renderer)

  setInspectorContext({
    scene,
    camera,
    renderer
  })
</script>

<Inspector />
