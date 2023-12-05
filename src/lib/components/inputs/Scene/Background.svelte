<script lang='ts'>
  // import { useSinglePixelImage } from '$lib/hooks/use-single-pixel-image';
  import { useBinding, useSeparator } from '$lib/components/tweakpane'

  export let object: THREE.Scene

  // const params = {
  //   background: useSinglePixelImage(),
  //   fogColor: '#000000',
  //   gridDistance: load<number>('three-inspect.gridDistance') ?? 100,
  //   gridLargeCellSize: load<number>('three-inspect.largeCellSize') ?? 10,
  // }

  useSeparator()
  useBinding({ label: 'backgroundBlurriness', object })
  useBinding({ label: 'backgroundIntensity', object })
</script>

<!-- <Input key='background' {object} /> -->
