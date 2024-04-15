<script lang="ts">
	import { resolvePropertyPath } from '@threlte/core'
	import { Binding } from 'svelte-tweakpane-ui'
	import { buildTransaction } from '../buildTransaction'
	import { useTransactions } from '../../transactions/useTransactions'
	import type { BindingParams } from 'tweakpane'

	const { commit } = useTransactions()

	type Props = {
		objects: any[]
		key: string
		label: string
		options?: BindingParams
	}

	let { objects, key, label, ...rest }: Props = $props()

	const firstObject = $derived(objects[0])

	const carrier: Record<string, any> = {}
	const { target, key: targetKey } = resolvePropertyPath(firstObject, key)

	if (
		typeof target[targetKey] === 'object' &&
		'clone' in target[targetKey] &&
		typeof target[targetKey].clone === 'function'
	) {
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
	on:change={(e) => {
		commit(objects.map((object) => buildTransaction(object, key, e.detail.value)))
	}}
	{...rest}
/>
