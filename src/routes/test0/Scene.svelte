<script lang='ts'>
  import { useThrelte } from '@threlte/core'
  import { Inspector } from '$lib'

  const { scene } = useThrelte()

  console.log(scene)
</script>

<Inspector />
