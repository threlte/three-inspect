<script lang='ts'>
import { Input } from './index'

export let key: string
export let params: Record<string, any> | undefined = undefined
export let value: any | undefined = undefined
export let options: string[] | [string, any][] = []
export let label: string | boolean | undefined = undefined

const cells = (x: number) => Array.isArray(options[x])
  ? ({ title: options[x][0], value: options[x][1] })
  : ({ title: options[x], value: options[x] })

</script>

<Input
  {key}
  {params}
  {value}
  {label}
  inputParams={{
    view: 'radiogrid',
    groupName: '',
    size: [options.length, 1],
    cells,
  }}
  on:change
/>
