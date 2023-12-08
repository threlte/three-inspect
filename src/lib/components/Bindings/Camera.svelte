<script lang='ts'>
  import { Binding } from 'svelte-tweakpane-ui'
  import Object3D from './Object.svelte'

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
  <Binding bind:object key='fov' label='fov' {options} />
  <Binding bind:object key='filmOffset' label='filmOffset' {options} />
  <Binding bind:object key='filmGauge' label='filmGauge' {options} />

{:else if 'isOrthographicCamera' in object}
  <Binding bind:object key='bottom' label='bottom' {options} />
  <Binding bind:object key='left' label='left' {options} />
  <Binding bind:object key='right' label='right' {options} />
  <Binding bind:object key='top' label='top' {options} />
{/if}

<Object3D {object} />
