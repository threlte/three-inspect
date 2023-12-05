<script lang='ts'>
  import { useBinding } from '$lib/components/tweakpane'

  export let object: any
  export let label: string
  export let link: (key: string) => void

  $: colorParams = { [label]: `#${object[label].getHexString()}` }

  const onChange = () => object[label].set(colorParams[label])

  useBinding({ label: label, object, onChange })
</script>
