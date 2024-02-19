<script lang="ts">
	import { Grid } from '@threlte/extras'
	import { onDestroy } from 'svelte'
	import {
		Color,
		RadioGrid,
		Slider,
		type ColorValue,
		type RadioGridChangeEvent,
	} from 'svelte-tweakpane-ui'
	import DropDownPane from '../../components/DropDownPane/DropDownPane.svelte'
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
				color: persist('#5f5f5f'),
				step: persist(1),
				plane: persist('xz'),
			}
		},
		actions: {
			setEnabled({ select }, enabled) {
				select((s) => s.enabled).set(enabled)
			},
			toggleEnabled({ select }) {
				select((s) => s.enabled).update((enabled) => !enabled)
			},
			setColor({ select }, color) {
				select((s) => s.color).set(color)
			},
			setStep({ select }, step) {
				select((s) => s.step).set(step)
			},
			setPlane({ select }, plane) {
				select((s) => s.plane).set(plane)
			},
		},
	})

	onDestroy(() => {
		removeExtension(gridScope)
	})

	const enabled = state.select((s) => s.enabled)
	const color = state.select((s) => s.color)
	const step = state.select((s) => s.step)
	const plane = state.select((s) => s.plane)

	const onColorChange = (e: CustomEvent<{ value: ColorValue }>) => {
		runGridAction('setColor', e.detail.value as string)
	}

	const onPlaneChange = (e: RadioGridChangeEvent) => {
		runGridAction('setPlane', e.detail.value as 'xy' | 'xz' | 'zy')
	}

	const onStepChange = (e: CustomEvent<{ value: number }>) => {
		runGridAction('setStep', e.detail.value)
	}
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

		<DropDownPane title="Grid Settings">
			<Color
				value={$color}
				label="Color"
				on:change={onColorChange}
			/>

			<Slider
				value={$step}
				label="Step"
				min={0}
				on:change={onStepChange}
			/>
			<RadioGrid
				value={$plane}
				values={['xy', 'xz', 'yz']}
				rows={1}
				label="Plane"
				on:change={onPlaneChange}
			/>
		</DropDownPane>
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
		cellSize={$step}
		sectionColor={$color}
		cellColor={$color}
		plane={$plane}
		renderOrder={9999}
	/>
{/if}
