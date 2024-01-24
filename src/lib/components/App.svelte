<script lang="ts">
	import { HierarchicalObject, useThrelte } from '@threlte/core'
	import { Grid } from '@threlte/extras'
	import { add } from '../hooks/useOnAdd'
	import { remove } from '../hooks/useOnRemove'
	import { getInternalContext, useInspector } from '../internal/context'
	import AxesHelper from './Internal/AxesHelper.svelte'
	import Portal from './Internal/Portal.svelte'
	import Draggable from './Positions/Draggable.svelte'
	import Inline from './Positions/Inline.svelte'
	import FreeCamera from './Tools/FreeCamera.svelte'
	import Helpers from './Tools/Helpers.svelte'
	import Raycast from './Tools/Raycast.svelte'
	import TransformControls from './Tools/TransformControls.svelte'

	const { position } = useInspector()
	const { scene } = useThrelte()
	const { usingRaycast, selectedObject, gizmoSettings, toolSettings, studioObjects } =
		getInternalContext()

	$: object = $selectedObject
	$: component = $position === 'inline' ? Inline : Draggable

	const onCreate = (args: { ref: THREE.Object3D; cleanup: (callback: () => void) => void }) => {
		studioObjects.update((objects) => {
			objects.add(args.ref)
			return objects
		})
		args.cleanup(() => {
			studioObjects.update((objects) => {
				objects.delete(args.ref)
				return objects
			})
		})
	}
</script>

<Portal>
	{#if $$slots.default}
		<svelte:component this={component}>
			<slot />
		</svelte:component>
	{:else}
		<svelte:component this={component} />
	{/if}
</Portal>

<!-- Ensure that all inspector objects are added to the scene passed to the inspector -->
<HierarchicalObject
	onChildMount={(child) => add.call(scene, child)}
	onChildDestroy={(child) => remove.call(scene, child)}
>
	{#if $gizmoSettings.grid.visible}
		<Grid
			infiniteGrid
			cellSize={1}
			renderOrder={9999}
			sectionColor="#555"
			on:create={onCreate}
		/>
	{/if}

	{#if $gizmoSettings.axes.visible}
		<AxesHelper
			length={1000}
			width={0.2}
			on:create={onCreate}
		/>
	{/if}

	{#if $toolSettings.freeCamera.enabled}
		<FreeCamera />
	{/if}

	{#if $usingRaycast}
		<Raycast />
	{/if}

	{#if object && !('isScene' in object)}
		{#if $toolSettings.transformControls.enabled}
			{#key object}
				<TransformControls {object} />
			{/key}
		{/if}

		{#if $gizmoSettings.helpers.visible}
			<Helpers {object} />
		{/if}
	{/if}
</HierarchicalObject>
