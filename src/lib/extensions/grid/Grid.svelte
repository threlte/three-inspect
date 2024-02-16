<script lang="ts">
	import { Grid } from '@threlte/extras'
	import { onDestroy } from 'svelte'
	import ToolbarButton from '../../components/ToolbarButton/ToolbarButton.svelte'
	import ToolbarItem from '../../components/ToolbarItem/ToolbarItem.svelte'
	import HorizontalButtonGroup from '../../components/Tools/HorizontalButtonGroup.svelte'
	import { useStudio } from '../../internal/extensions'
	import { useStudioObjectsRegistry } from '../studio-objects-registry/useStudioObjectsRegistry'
	import { gridScope, type GridActions, type GridState } from './types'

	const { addExtension, removeExtension } = useStudio()
	const { addObject, removeObject } = useStudioObjectsRegistry()

	const { state, run: runGridAction } = addExtension<GridState, GridActions>({
		scope: gridScope,
		state({ persist }) {
			return {
				enabled: persist(true),
			}
		},
		actions: {
			setEnabled({ select }, enabled) {
				select((s) => s.enabled).set(enabled)
			},
			toggleEnabled({ select }) {
				select((s) => s.enabled).update((enabled) => !enabled)
			},
		},
	})

	onDestroy(() => {
		removeExtension(gridScope)
	})

	const enabled = state.select((s) => s.enabled)
</script>

<ToolbarItem position="left">
	<HorizontalButtonGroup>
		<ToolbarButton
			on:click={() => {
				runGridAction('toggleEnabled')
			}}
			active={$enabled}
			label="Grid"
			icon="mdiGrid"
			tooltip="Grid"
		/>

		<!-- <DropDownPane title="Settings">
			<Checkbox
				value={true}
				on:change={(e) => {
					if (e.detail.value) {
						run('enable')
					} else {
						run('disable')
					}
				}}
				label="Enabled"
			/>
		</DropDownPane> -->
	</HorizontalButtonGroup>
</ToolbarItem>

{#if $enabled}
	<Grid
		on:create={({ ref, cleanup }) => {
			addObject(ref)
			cleanup(() => {
				removeObject(ref)
			})
		}}
		userData={{ ignoreOverrideMaterial: true }}
		infiniteGrid
		cellSize={1}
		renderOrder={9999}
		plane={'xz'}
	/>
{/if}
