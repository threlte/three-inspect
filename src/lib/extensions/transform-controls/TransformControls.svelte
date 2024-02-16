<script lang="ts">
	import { onDestroy } from 'svelte'
	import { Checkbox } from 'svelte-tweakpane-ui'
	import { get } from 'svelte/store'
	import type { Object3D } from 'three'
	import DropDownPane from '../../components/DropDownPane/DropDownPane.svelte'
	import ToolbarButton from '../../components/ToolbarButton/ToolbarButton.svelte'
	import ToolbarItem from '../../components/ToolbarItem/ToolbarItem.svelte'
	import HorizontalButtonGroup from '../../components/Tools/HorizontalButtonGroup.svelte'
	import { useStudio } from '../../internal/extensions'
	import { useObjectSelection } from '../object-selection/useObjectSelection'
	import ContainerTransform from './ContainerTransform.svelte'
	import SingleTransform from './SingleTransform.svelte'
	import {
		transformControlsScope,
		type TransformControlsActions,
		type TransformControlsState,
	} from './types'

	const { addExtension, removeExtension } = useStudio()

	const { run, state } = addExtension<TransformControlsState, TransformControlsActions>({
		scope: transformControlsScope,
		state: ({ persist }) => ({
			enabled: persist(true),
			mode: persist('translate' as TransformControlsState['mode']),
			inUse: false,
		}),
		actions: {
			enable({ select }) {
				select((s) => s.enabled).set(true)
			},
			disable({ select }) {
				select((s) => s.enabled).set(false)
				select((s) => s.inUse).set(false)
			},
			toggle({ select }) {
				const enabled = select((s) => s.enabled)
				enabled.update((enabled) => !enabled)
				if (!get(enabled)) {
					select((s) => s.inUse).set(false)
				}
			},
			setMode({ select }, mode) {
				select((s) => s.mode).set(mode)
			},
			translate({ select }) {
				select((s) => s.mode).set('translate')
			},
			rotate({ select }) {
				select((s) => s.mode).set('rotate')
			},
			scale({ select }) {
				select((s) => s.mode).set('scale')
			},
			setInUse({ select }, inUse) {
				select((s) => s.inUse).set(inUse)
			},
		},
		keyMap() {
			return {
				translate: 't',
				rotate: 'r',
				scale: 's',
				toggleInUse: 'z',
			}
		},
	})

	onDestroy(() => {
		removeExtension(transformControlsScope)
	})

	const mode = state.select((s) => s.mode)
	const enabled = state.select((s) => s.enabled)

	const { selectedObjects } = useObjectSelection()

	const key = (objects: Object3D[]) => objects.map((o) => o.uuid).join()
</script>

{#if $enabled}
	{#if $selectedObjects.length > 1}
		{#key key($selectedObjects)}
			<ContainerTransform />
		{/key}
	{:else if $selectedObjects.length === 1}
		{#key key($selectedObjects)}
			<SingleTransform />
		{/key}
	{/if}
{/if}

<ToolbarItem position="left">
	<HorizontalButtonGroup>
		<ToolbarButton
			on:click={() => {
				run('setMode', 'translate')
			}}
			active={$mode === 'translate'}
			label="Move"
			icon="mdiRayEndArrow"
			tooltip="Move (T)"
		/>

		<ToolbarButton
			on:click={() => {
				run('setMode', 'rotate')
			}}
			active={$mode === 'rotate'}
			label="Rotate"
			icon="mdiRotateLeft"
			tooltip="Rotate (R)"
		/>

		<ToolbarButton
			on:click={() => {
				run('setMode', 'scale')
			}}
			active={$mode === 'scale'}
			label="Scale"
			icon="mdiArrowExpand"
			tooltip="Scale (S)"
		/>

		<DropDownPane title="Settings">
			<Checkbox
				value={$enabled}
				on:change={(e) => {
					if (e.detail.value) {
						run('enable')
					} else {
						run('disable')
					}
				}}
				label="Enabled"
			/>
		</DropDownPane>
	</HorizontalButtonGroup>
</ToolbarItem>
