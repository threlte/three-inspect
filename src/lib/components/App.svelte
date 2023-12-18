<script lang="ts">
	import { HierarchicalObject, useThrelte } from '@threlte/core'
	import { Grid } from '@threlte/extras'

	import { persisted } from '../internal/persisted'
	import { getInternalContext, useInspector } from '../internal/context'
	import { add } from '../hooks/useOnAdd'
	import { remove } from '../hooks/useOnRemove'
	import Portal from './Internal/Portal.svelte'
	import AxesHelper from './Internal/AxesHelper.svelte'
	import FreeCamera from './Tools/FreeCamera.svelte'
	import Raycast from './Tools/Raycast.svelte'
	import Inline from './Positions/Inline.svelte'
	import Draggable from './Positions/Draggable.svelte'
	import TransformControls from './Tools/TransformControls.svelte'
	import Helpers from './Tools/Helpers.svelte'

	const { position } = useInspector()
	const { scene } = useThrelte()
	const { usingFreeCamera, usingRaycast, selectedObject } = getInternalContext()

	const grid = persisted('grid', true)
	const axes = persisted('axes', true)

	$: object = $selectedObject
	$: component = $position === 'inline' ? Inline : Draggable
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
	{#if $grid}
		<Grid
			infiniteGrid
			cellSize={1}
			renderOrder={9999}
			sectionColor="#555"
		/>
	{/if}

	{#if $axes}
		<AxesHelper
			length={1000}
			width={0.2}
		/>
	{/if}

	{#if $usingFreeCamera}
		<FreeCamera />
	{/if}

	{#if $usingRaycast}
		<Raycast />
	{/if}

	{#if object && !('isScene' in object)}
		{#key object}
			<TransformControls {object} />
		{/key}

		<Helpers {object} />
	{/if}
</HierarchicalObject>
