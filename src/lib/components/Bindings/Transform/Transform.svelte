<script lang="ts">
  import { useTask, watch } from '@threlte/core'
  import { Separator } from 'svelte-tweakpane-ui'
  import * as THREE from 'three'
  import { getInternalContext } from '../../../internal/context'
  import SerializedBinding from '../SerializedBinding.svelte'
  import Instance from './Instance.svelte'

  export let object: THREE.Object3D

  const { toolSettings } = getInternalContext()

  let refreshPosition: (() => void) | undefined
  let refreshRotation: (() => void) | undefined
  let refreshScale: (() => void) | undefined

  const { start, stop } = useTask(
    () => {
      if (!object) return
      refreshPosition?.()
      refreshRotation?.()
      refreshScale?.()
    },
    {
      autoInvalidate: false,
      autoStart: false,
    },
  )

  watch(toolSettings, (settings) => {
    if (settings.transformControls.inUse) {
      start()
    } else {
      stop()
    }
  })
</script>

<SerializedBinding
  bind:object
  key="position"
  label="position"
  bind:refresh={refreshPosition}
/>
<SerializedBinding
  bind:object
  key="rotation"
  label="rotation"
  bind:refresh={refreshRotation}
/>
<SerializedBinding
  bind:object
  key="scale"
  label="scale"
  bind:refresh={refreshScale}
/>

{#if object instanceof THREE.InstancedMesh}
  <Separator />
  <Instance {object} />
{/if}
