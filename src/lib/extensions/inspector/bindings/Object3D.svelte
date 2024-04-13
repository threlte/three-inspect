<script lang="ts">
	import { Object3D } from 'three'
	import { useTransactions } from '../../transactions/useTransactions'
	import { buildTransaction } from '../buildTransaction'
	import SerializableBinding from './SerializableBinding.svelte'
	import { haveProperty } from './utils'

	const { commit } = useTransactions()

	type Props = {
		objects: Object3D[]
	}

	let { objects }: Props = $props()
</script>

{#if haveProperty(objects, 'visible')}
	{@const firstObject = objects[0]}

	<SerializableBinding
		object={firstObject}
		key="position"
		label="position"
		on:change={(e) => {
			objects.forEach((object) => {
				const transaction = buildTransaction(object, 'position', e.detail.value)
				commit(transaction)
			})
		}}
	/>
{/if}
