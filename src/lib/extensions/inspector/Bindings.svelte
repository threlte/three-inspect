<script lang="ts">
	import { AutoValue } from 'svelte-tweakpane-ui'
	import type { Object3D } from 'three'
	import { useObjectSelection } from '../object-selection/useObjectSelection.svelte'
	import { defaultBindings, type Attribute } from './bindings'
	import { useTransactions } from '../transactions/useTransactions'

	const objectSelection = useObjectSelection()

	const { commit } = useTransactions()

	const appliesToAllObjects = (attribute: Attribute | Attribute[]) => {
		return objectSelection.selectedObjects.every((object) => {
			if (Array.isArray(attribute)) {
				return attribute.every((a) => a(object))
			}
			return attribute(object)
		})
	}

	const readFromFirst = (read: (obj: any) => any) => {
		if (objectSelection.selectedObjects.length === 0) return undefined
		return read(objectSelection.selectedObjects[0])
	}

	const keyFromObjects = (objects: Object3D[]) => {
		return objects.map((object) => object.uuid).join()
	}
</script>

{#if objectSelection.selectedObjects.length}
	{#key keyFromObjects(objectSelection.selectedObjects)}
		{#each defaultBindings as binding}
			{#if appliesToAllObjects(binding.attributes)}
				<!-- {#if binding.folder}
					<Folder
						title={binding.folder.label}
						expanded={binding.folder.open}
					>
						{#each binding.properties as property}
							<AutoValue
								value={readFromFirst(property.read)}
								label={property.label}
								on:change={(event) => {
									$selectedObjects.forEach((object) => {
										commit({
											object,
											propertyPath: property.label,
											value: event.detail.value,
											read: property.read,
											write: property.apply,
											sync: property.sync,
										})
									})
								}}
							/>
						{/each}
					</Folder>
				{:else} -->
				{#each binding.properties as property}
					<AutoValue
						value={readFromFirst(property.read)}
						label={property.label}
						on:change={(event) => {
							objectSelection.selectedObjects.forEach((object) => {
								const transaction = property.buildTransaction(object, event.detail.value)
								commit(transaction)
							})
							// $selectedObjects.forEach((object) => {
							// 	commit({
							// 		object,
							// 		propertyPath: property.label,
							// 		value: event.detail.value,
							// 		read: property.read,
							// 		write: property.apply,
							// 		sync: property.sync,
							// 	})
							// })
						}}
					/>
				{/each}
			{/if}
			<!-- {/if} -->
		{/each}
	{/key}
{/if}
