<script lang="ts">
	import { resolvePropertyPath, useTask } from '@threlte/core'
	import { onMount, tick } from 'svelte'
	import { Binding, type BindingRef } from 'svelte-tweakpane-ui'
	import type { BindingParams } from 'tweakpane'
	import { useTransactions } from '../../transactions/useTransactions'
	import { buildTransaction } from '../buildTransaction'

	const { commit, onTransaction } = useTransactions()

	type Props = {
		objects: any[]
		key: string
		label: string
		options?: BindingParams
		autoUpdate?: boolean
		ref?: BindingRef
	}

	let { objects, key, label, autoUpdate, ref = $bindable(), ...rest }: Props = $props()

	const firstObject = $derived(objects[0])

	const carrier: Record<string, any> = {}
	const { target, key: targetKey } = resolvePropertyPath(firstObject, key)

	const clone = (carrier: any, key: string) => {
		if (
			typeof carrier[key] === 'object' &&
			carrier[key] !== null &&
			'clone' in carrier[key] &&
			typeof carrier[key].clone === 'function'
		) {
			return carrier[key].clone()
		}
		return carrier[key]
	}

	carrier[targetKey] = clone(target, targetKey)

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

	onMount(() => onTransaction(start))

	let isFirst = true
	// Because properties can be mutated continouosly but should only record
	// history on interaction start, we need to store the value of the first
	// change event.
	let historicValue: any | undefined

	const changeHandler = (e: { last: boolean; value: any }) => {
		if (ignoreChangeEvent) return
		// Only write the value to the target object if it's the last or the first
		// change event.
		if (isFirst) {
			historicValue =
				typeof target[targetKey] === 'object' &&
				target[targetKey] !== null &&
				'clone' in target[targetKey] &&
				typeof target[targetKey].clone === 'function'
					? target[targetKey].clone()
					: target[targetKey]
		}

		// we commit the changes made to the object, but we only record history on
		// the last user interaction. syncing also only happens when the last user
		// interaction is completed.
		commit(
			objects.map((object) =>
				buildTransaction({
					object,
					propertyPath: key,
					value: clone(carrier, targetKey),
					noHistory: !e.last,
					noSync: !e.last,
					historicValue,
				}),
			),
		)

		// on the last user interaction, e.last is true. We use that to reset the
		// isFirst flag.
		isFirst = e.last
	}

	$effect(() => {
		if (!ref) return
		ref.on('change', changeHandler)
		return () => {
			if (!ref) return
			ref.off('change', changeHandler)
		}
	})
</script>

<Binding
	object={carrier}
	key={targetKey}
	{label}
	bind:ref
	on:change
	{...rest}
/>
