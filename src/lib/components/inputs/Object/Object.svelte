<script lang='ts'>
  import * as THREE from 'three'
  import { T, useFrame } from '@threlte/core'
  import { Folder, useBinding } from '$lib/components/tweakpane'
  import Transform from '../Transform/Transform.svelte'
  import Material from '../Material/Material.svelte'
  // import { useDocs } from '$lib/hooks/docs'
  import CastShadow from './CastShadow.svelte'
  import ReceiveShadow from './ReceiveShadow.svelte'
  import Misc from './Misc.svelte'
  import TransformControls from './TransformControls.svelte'
  
  // const docs = useDocs('core', 'Object3D')

  export let object: THREE.Object3D
  export let enableControls = true
  
  let helper: THREE.ArrowHelper | undefined

  // const link = (key: string) => docs(key)
  
  useFrame(() => {
    helper?.position.copy(object.position)
    helper?.quaternion.copy(object.quaternion)
    helper?.scale.copy(object.scale)
  })
  
  useBinding({ label: 'visible', object })

  $: isAmbient = object instanceof THREE.AmbientLight
</script>


{#if isAmbient === false}
  <Transform {object} />
  <CastShadow {object} />
{/if}

{#if (object instanceof THREE.Light) === false}
  <ReceiveShadow {object} />
{/if}

{#if object instanceof THREE.Mesh && object.material instanceof THREE.Material}
  <Folder title={`${object.material.name} (${object.material.type})`.trim()}>
    <Material object={object.material} />
  </Folder>
{/if}

<Misc {object} />

{#if isAmbient === false}
  <T.ArrowHelper
    bind:ref={helper}
    userData.threeInspectHide
  />
{/if}

<TransformControls {object} />
