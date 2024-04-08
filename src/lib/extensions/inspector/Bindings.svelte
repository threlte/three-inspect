<script lang="ts">
	import { useThrelte } from '@threlte/core'
	import { AutoValue, Folder } from 'svelte-tweakpane-ui'
	import type { Object3D } from 'three'
	import { useObjectSelection } from '../object-selection/useObjectSelection'
	import { useTransactions } from '../transactions/useTransactions'
	import { defaultBindings, type Attribute, type Read } from './bindings'

	const { selectedObjects } = useObjectSelection()
	const { invalidate } = useThrelte()

	const { commit } = useTransactions()

	const appliesToAllObjects = (attribute: Attribute | Attribute[]) => {
		return $selectedObjects.every((object) => {
			if (Array.isArray(attribute)) {
				return attribute.every((a) => a(object))
			}
			return attribute(object)
		})
	}

	const readFromFirst = (read: Read<any>) => {
		if ($selectedObjects.length === 0) return undefined
		return read($selectedObjects[0])
	}

	const keyFromObjects = (objects: Object3D[]) => {
		return objects.map((object) => object.uuid).join()
	}
</script>

{#if $selectedObjects.length}
	{#key keyFromObjects($selectedObjects)}
		{#each defaultBindings as binding}
			{#if appliesToAllObjects(binding.attributes)}
				{#if binding.folder}
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
				{:else}
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
				{/if}
			{/if}
		{/each}
	{/key}
{/if}
