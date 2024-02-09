<script lang="ts">
	import { onDestroy } from 'svelte'
	import { Checkbox } from 'svelte-tweakpane-ui'
	import DropDownPane from '../../components/DropDownPane/DropDownPane.svelte'
	import ToolbarButton from '../../components/ToolbarButton/ToolbarButton.svelte'
	import ToolbarItem from '../../components/ToolbarItem/ToolbarItem.svelte'
	import HorizontalButtonGroup from '../../components/Tools/HorizontalButtonGroup.svelte'
	import { useStudio } from '../../internal/extensions'
	import {
		transformControlsScope,
		type TransformControlsActions,
		type TransformControlsState,
	} from './types'
	import { watch } from '@threlte/core'

	const { addExtension, removeExtension, getExtension } = useStudio()

	const tc = getExtension('abc').select((s) => s.enabled)

	watch(tc, (tc) => {
		console.log('tc', tc)
	})

	addExtension({
		scope: 'abc',
		state: () => ({
			enabled: true,
		}),
		actions: {},
	})

	const { run, select } = addExtension<TransformControlsState, TransformControlsActions>({
		scope: transformControlsScope,
		state: ({ persist }) => ({
			enabled: persist(false),
			mode: 'translate' as TransformControlsState['mode'],
			inUse: false,
		}),
		actions: {
			enable({ select }) {
				select((s) => s.enabled).set(true)
			},
			disable({ select }) {
				select((s) => s.enabled).set(false)
			},
			toggle({ select }) {
				select((s) => s.enabled).update((enabled) => !enabled)
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
			toggleInUse({ select }) {
				select((s) => s.inUse).update((inUse) => !inUse)
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

	const mode = select((s) => s.mode)
</script>

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
		</DropDownPane>
	</HorizontalButtonGroup>
</ToolbarItem>
