<script lang="ts">
	import { resolvePropertyPath, useTask } from '@threlte/core'
	import { Binding, type BindingRef } from 'svelte-tweakpane-ui'
	import type { BindingParams } from 'tweakpane'
	import { useTransactions } from '../../transactions/useTransactions'
	import { buildTransaction } from '../buildTransaction'
	import { tick } from 'svelte'

	const { commit } = useTransactions()

	type Props = {
		objects: any[]
		key: string
		label: string
		options?: BindingParams
		autoUpdate?: boolean
	}

	let { objects, key, label, autoUpdate, ...rest }: Props = $props()

	const firstObject = $derived(objects[0])

	const carrier: Record<string, any> = {}
	const { target, key: targetKey } = resolvePropertyPath(firstObject, key)

	if (
		typeof target[targetKey] === 'object' &&
		target[targetKey] !== null &&
		'clone' in target[targetKey] &&
		typeof target[targetKey].clone === 'function'
	) {
		const cloned = target[targetKey].clone()
		carrier[targetKey] = cloned
	} else {
		carrier[targetKey] = target[targetKey]
	}

	let ref = $state<BindingRef>()
	let ignoreChangeEvent = false

	const { start, stop } = useTask(
		async () => {
			if (!ref) return
			if (typeof carrier[targetKey] === 'object' && carrier[targetKey] !== null) {
				if ('equals' in carrier[targetKey] && typeof carrier[targetKey].equals === 'function') {
					if (carrier[targetKey].equals(target[targetKey])) {
						return
					}
				}
				if ('copy' in carrier[targetKey] && typeof carrier[targetKey].copy === 'function') {
					carrier[targetKey].copy(target[targetKey])
				}
			} else {
				carrier[targetKey] = target[targetKey]
			}
			ignoreChangeEvent = true
			ref.refresh()
			await tick()
			ignoreChangeEvent = false
		},
		{
			autoStart: autoUpdate,
			autoInvalidate: false,
		},
	)

	$effect(() => {
		if (autoUpdate) {
			start()
		} else {
			stop()
		}
	})
</script>

<Binding
	object={carrier}
	{key}
	{label}
	bind:ref
	on:change={(e) => {
		if (ignoreChangeEvent) return
		commit(objects.map((object) => buildTransaction(object, key, e.detail.value)))
	}}
	on:change
	{...rest}
/>
