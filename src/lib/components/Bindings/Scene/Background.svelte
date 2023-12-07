<script lang='ts'>
  // import { useSinglePixelImage } from '$lib/hooks/use-single-pixel-image';
  import { Binding, Separator } from 'svelte-tweakpane-ui'

  export let object: THREE.Scene

  // const params = {
  //   background: useSinglePixelImage(),
  //   fogColor: '#000000',
  //   gridDistance: load<number>('three-inspect.gridDistance') ?? 100,
  //   gridLargeCellSize: load<number>('three-inspect.largeCellSize') ?? 10,
  // }
</script>

<Separator />
<Binding bind:object key='backgroundBlurriness' label='backgroundBlurriness' />
<Binding bind:object key='backgroundIntensity' label='backgroundIntensity' />

<!-- <Input key='background' {object} /> -->
