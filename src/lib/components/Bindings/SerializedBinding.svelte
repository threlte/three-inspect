<script lang="ts">
	import { useTask, useThrelte } from '@threlte/core'
	import { Binding, type BindingRef } from 'svelte-tweakpane-ui'

	export let object: any
	export let key: string
	export let label: string
	export let options: any = {}

	let ref: BindingRef

	const { invalidate } = useThrelte()

	const didChange = (currentValue: any, previousValue: any): boolean => {
		if (typeof currentValue !== typeof previousValue) return true
		if (typeof currentValue === 'number') {
			return currentValue !== previousValue
		}
		if (typeof currentValue === 'string') {
			return currentValue !== previousValue
		}
		if (Array.isArray(currentValue)) {
			if (currentValue.length !== previousValue.length) return true
			for (let i = 0; i < currentValue.length; i++) {
				if (didChange(currentValue[i], previousValue[i])) return true
			}
			return false
		}
		if (typeof currentValue === 'object') {
			const keys = Object.keys(currentValue)
			if (keys.length !== Object.keys(previousValue).length) return true
			for (const key of keys) {
				if (didChange(currentValue[key], previousValue[key])) return true
			}
			return false
		}
		if (typeof currentValue === 'boolean') {
			return currentValue !== previousValue
		}
		return currentValue !== previousValue
	}

	const isPrimitive = (value: any): boolean | string | number | undefined => {
		return (
			typeof value === 'number' ||
			typeof value === 'string' ||
			typeof value === 'boolean' ||
			typeof value === 'undefined'
		)
	}

	const transformAttributeValue = (value: any) => {
		if (isPrimitive(value)) {
			return value
		}
		if (value.isVector3) {
			return value.toArray()
		}
		if (value.isVector2) {
			return value.toArray()
		}
		if (value.isColor) {
			return `#${value.getHexString()}`
		}
		if (value.isMatrix4) {
			return value.toArray()
		}
		if (value.isQuaternion) {
			return value.toArray()
		}
		if (value.isEuler) {
			return value.toArray()
		}
		return value
	}

	const mutateComponent = (attribute: string, value: any) => {
		if (!import.meta.hot) return
		import.meta.hot.send('threlte-inspector:from-client', {
			...object.userData.inspectorOptions,
			attribute,
			value,
		})
	}

	let previousValue: any = transformAttributeValue(object[key])
	useTask(
		() => {
			const currentValue = transformAttributeValue(object[key])
			if (didChange(currentValue, previousValue)) {
				mutateComponent(key, currentValue)
				invalidate()
			}
			previousValue = currentValue

			if (!ref) return
			ref.refresh()
		},
		{ autoInvalidate: false, autoStart: !!object.inspectorOptions && !!import.meta.hot }
	)
</script>

<Binding
	bind:ref
	bind:object
	{key}
	{label}
	{options}
/>
