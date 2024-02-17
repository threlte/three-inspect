<script lang="ts">
	import { useThrelte } from '@threlte/core'
	import { AutoValue, Folder } from 'svelte-tweakpane-ui'
	import type { Object3D } from 'three'
	import { useObjectSelection } from '../object-selection/useObjectSelection'
	import { defaultBindings, type Attribute, type Read } from './bindings'

	const { selectedObjects } = useObjectSelection()
	const { invalidate } = useThrelte()

	const appliesToAllObjects = (attribute: Attribute) => {
		return $selectedObjects.every((object) => attribute(object))
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
			{#if appliesToAllObjects(binding.attribute)}
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
										property.apply(object, event.detail.value)
									})
									invalidate()
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
									property.apply(object, event.detail.value)
								})
								invalidate()
							}}
						/>
					{/each}
				{/if}
			{/if}
		{/each}
	{/key}
{/if}
