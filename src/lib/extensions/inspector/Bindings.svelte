<script lang="ts">
	import type { Object3D } from 'three'
	import { useObjectSelection } from '../object-selection/useObjectSelection.svelte'
	import Material from './bindings/Material.svelte'
	import Object3DBinding from './bindings/Object3D.svelte'
	import { Folder, Textarea } from 'svelte-tweakpane-ui'

	const objectSelection = useObjectSelection()
	const keyFromObjects = (objects: Object3D[]) => {
		return objects.map((object) => object.uuid).join()
	}

	const materials = $derived(objectSelection.selectedObjects.map((o) => o.material))

	const firstObjectUserData = $derived(
		JSON.stringify(objectSelection.selectedObjects[0].userData, null, 2),
	)
</script>

{#if objectSelection.selectedObjects.length}
	{#key keyFromObjects(objectSelection.selectedObjects)}
		<Object3DBinding objects={objectSelection.selectedObjects} />

		<Material {materials} />
	{/key}
{/if}

{#if firstObjectUserData}
	<Folder
		title="userData"
		expanded={false}
	>
		<Textarea
			value={firstObjectUserData}
			disabled
			rows={5}
		/>
	</Folder>
{/if}
