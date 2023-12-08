<script lang='ts'>
  import * as THREE from 'three'
  import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
  import { T } from '@threlte/core'
  import { getInternalContext } from '../../internal/context'
  import { useUpdate } from '../../hooks/useUpdate'

  const { usingFreeCamera } = getInternalContext()

  export let object: THREE.Object3D

  let ref: THREE.CameraHelper | undefined

  useUpdate(() => ref?.update())
</script>

{#if 'isCamera' in object}
  {#if $usingFreeCamera}
    <T.CameraHelper bind:ref args={[object]} />
  {/if}

{:else if object instanceof THREE.Light}
  {#if object.shadow}
    <T.CameraHelper args={[object.shadow.camera]} />
  {/if}

  {#if 'isDirectionalLight' in object}
    <T.DirectionalLightHelper args={[object, 10]} />

  {:else if 'isSpotLight' in object}
    <T.SpotLightHelper args={[object]} />

  {:else if 'isPointLight' in object}
    <T.PointLightHelper args={[object, 10]} />

  {:else if 'isHemisphereLight' in object}
    <T.HemisphereLightHelper args={[object, 10]} />

  {:else if 'isRectAreaLight' in object}
    <T is={RectAreaLightHelper} args={[object]} />

  {/if}
{/if}