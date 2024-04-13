<script lang="ts">
	import { resolvePropertyPath } from '@threlte/core'
	import { Binding } from 'svelte-tweakpane-ui'

	type Props = {
		object: any
		key: string
		label: string
	}

	let { object, key, label }: Props = $props()

	const carrier: Record<string, any> = {}
	const { target, key: targetKey } = resolvePropertyPath(object, key)

	if ('clone' in target[targetKey] && typeof target[targetKey].clone === 'function') {
		const cloned = target[targetKey].clone()
		carrier[targetKey] = cloned
	} else {
		carrier[targetKey] = target[targetKey]
	}
</script>

<Binding
	object={carrier}
	{key}
	{label}
	on:change
/>
