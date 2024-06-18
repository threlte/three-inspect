<script lang="ts">
	import { HierarchicalObject, useThrelte } from '@threlte/core'
	import { Grid } from '@threlte/extras'

	import { persisted } from '../internal/persisted'
	import { getInternalContext } from '../internal/context'
	import { add } from '../hooks/useOnAdd'
	import { remove } from '../hooks/useOnRemove'
	import Portal from './Internal/Portal.svelte'
	import AxesHelper from './Internal/AxesHelper.svelte'
	import FreeCamera from './Tools/FreeCamera.svelte'
	import Raycast from './Tools/Raycast.svelte'
	import Draggable from './Positions/Draggable.svelte'
	import TransformControls from './Tools/TransformControls.svelte'
	import Helpers from './Tools/Helpers.svelte'

	const { scene } = useThrelte()
	const { usingFreeCamera, usingRaycast, selectedObject } = getInternalContext()

	const grid = persisted('grid', true)
	const axes = persisted('axes', true)

	$: object = $selectedObject
</script>

<Portal>
	{#if $$slots.default}
		<Draggable>
			<slot />
		</Draggable>
	{:else}
		<Draggable />
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
