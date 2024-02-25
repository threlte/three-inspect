<script lang="ts">
	import { T } from '@threlte/core'
	import { onDestroy } from 'svelte'
	import { Light, Object3D, type Camera } from 'three'
	import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
	import ToolbarButton from '../../components/ToolbarButton/ToolbarButton.svelte'
	import ToolbarItem from '../../components/ToolbarItem/ToolbarItem.svelte'
	import HorizontalButtonGroup from '../../components/Tools/HorizontalButtonGroup.svelte'
	import { useStudio } from '../../internal/extensions'
	import { useObjectSelection } from '../object-selection/useObjectSelection'
	import { useStudioObjectsRegistry } from '../studio-objects-registry/useStudioObjectsRegistry'
	import { helpersScope, type HelpersActions, type HelpersState } from './types'
	import AxesHelper from './AxesHelper.svelte'
	import { Gizmo } from '@threlte/extras'

	const { addExtension, removeExtension } = useStudio()

	const { state, run } = addExtension<HelpersState, HelpersActions>({
		scope: helpersScope,
		state({ persist }) {
			return {
				enabled: persist(true),
			}
		},
		actions: {
			toggleEnabled({ select }) {
				select((s) => s.enabled).update((enabled) => !enabled)
			},
			setEnabled({ select }, enabled) {
				select((s) => s.enabled).set(enabled)
			},
		},
	})

	onDestroy(() => {
		removeExtension(helpersScope)
	})

	const enabled = state.select((s) => s.enabled)

	const { selectedObjects } = useObjectSelection()

	const { addObject, removeObject } = useStudioObjectsRegistry()

	const onCreate = (args: { ref: Object3D; cleanup: (callback: () => void) => void }) => {
		addObject(args.ref)
		args.cleanup(() => {
			removeObject(args.ref)
		})
	}

	const isCamera = (object: any): object is Camera => {
		return object.isCamera
	}

	const isLight = (object: any): object is Light => {
		return object.isLight
	}
</script>

<ToolbarItem position="left">
	<HorizontalButtonGroup>
		<ToolbarButton
			on:click={() => {
				run('toggleEnabled')
			}}
			active={$enabled}
			label="Helpers"
			icon="mdiFitToScreen"
			tooltip="Helpers"
		/>
	</HorizontalButtonGroup>
</ToolbarItem>

{#if $enabled}
	<Gizmo
		paddingX={6}
		paddingY={6}
		verticalPlacement="bottom"
		size={100}
		horizontalPlacement="left"
	/>

	<AxesHelper
		length={2}
		width={0.2}
		on:create={onCreate}
	/>

	{#each $selectedObjects as object}
		{#if isCamera(object)}
			<T.CameraHelper
				userData={{ ignoreOverrideMaterial: true }}
				args={[object]}
				on:create={onCreate}
			/>
		{:else if isLight(object)}
			{#if object.shadow}
				<T.CameraHelper
					userData={{ ignoreOverrideMaterial: true }}
					args={[object.shadow.camera]}
					on:create={onCreate}
				/>
			{/if}

			{#if 'isDirectionalLight' in object}
				<T.DirectionalLightHelper
					userData={{ ignoreOverrideMaterial: true }}
					args={[object, 10]}
					on:create={onCreate}
				/>
			{:else if 'isSpotLight' in object}
				<T.SpotLightHelper
					userData={{ ignoreOverrideMaterial: true }}
					args={[object]}
					on:create={onCreate}
				/>
			{:else if 'isPointLight' in object}
				<T.PointLightHelper
					userData={{ ignoreOverrideMaterial: true }}
					args={[object, 10]}
					on:create={onCreate}
				/>
			{:else if 'isHemisphereLight' in object}
				<T.HemisphereLightHelper
					userData={{ ignoreOverrideMaterial: true }}
					args={[object, 10]}
					on:create={onCreate}
				/>
			{:else if 'isRectAreaLight' in object}
				<T
					userData={{ ignoreOverrideMaterial: true }}
					is={RectAreaLightHelper}
					on:create={onCreate}
					args={[object]}
				/>
			{/if}
		{/if}
	{/each}
{/if}
