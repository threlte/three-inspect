<script lang='ts'>
  import { Binding } from 'svelte-tweakpane-ui'
  import Object3D from '../Object/Object.svelte'
  import Perspective from './Perspective.svelte'
  import Orthographic from './Orthographic.svelte'

  export let object: THREE.PerspectiveCamera | THREE.OrthographicCamera

  const options = {
    onChange() {
      object.updateProjectionMatrix()
    }
  }
</script>

<Binding bind:object key='near' label='near' {options} />
<Binding bind:object key='far' label='far' {options} />
<Binding bind:object key='zoom' label='zoom' />

{#if 'isPerspectiveCamera' in object}
  <Perspective {object} />
{:else if 'isOrthographicCamera' in object}
  <Orthographic {object} />
{/if}

<Object3D {object} />

