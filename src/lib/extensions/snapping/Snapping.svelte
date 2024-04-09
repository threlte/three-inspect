<script lang="ts">
	import { onDestroy } from 'svelte'
	import { useStudio } from '../../internal/extensions'
	import { type SnappingState, type SnappingActions, snappingScope } from './types'
	import ToolbarItem from '../../components/ToolbarItem/ToolbarItem.svelte'
	import ToolbarButton from '../../components/ToolbarButton/ToolbarButton.svelte'
	import HorizontalButtonGroup from '../../components/Tools/HorizontalButtonGroup.svelte'
	import DropDownPane from '../../components/DropDownPane/DropDownPane.svelte'
	import { Slider } from 'svelte-tweakpane-ui'

	const { addExtension, removeExtension } = useStudio()

	const { state, run } = addExtension<SnappingState, SnappingActions>({
		scope: snappingScope,
		state({ persist }) {
			return {
				enabled: true,
				translate: 0.1,
				rotate: 15,
				scale: 0.1,
			}
		},
		actions: {
			toggleEnabled({ state }) {
				state.value.enabled = !state.value.enabled
			},
			setEnabled({ state }, enabled) {
				state.value.enabled = enabled
			},
			setRotate({ state }, rotate) {
				state.value.rotate = rotate
			},
			setScale({ state }, scale) {
				state.value.scale = scale
			},
			setTranslate({ state }, translate) {
				state.value.translate = translate
			},
		},
		keyMap() {
			return {
				toggleEnabled: 'm',
			}
		},
	})

	onDestroy(() => {
		removeExtension(snappingScope)
	})

	// const enabled = state.select((s) => s.enabled)
	// const translate = state.select((s) => s.translate)
	// const rotate = state.select((s) => s.rotate)
	// const scale = state.select((s) => s.scale)
</script>

<ToolbarItem>
	<HorizontalButtonGroup>
		<ToolbarButton
			active={state.value.enabled}
			icon="mdiMagnet"
			label="Snapping"
			tooltip="Snapping (M)"
			on:click={() => {
				run('toggleEnabled')
			}}
		/>
		<DropDownPane title="Snapping Settings">
			<Slider
				label="Move"
				min={0}
				value={state.value.translate}
				on:change={(e) => {
					run('setTranslate', e.detail.value)
				}}
			/>
			<Slider
				label="Rotate"
				min={0}
				value={state.value.rotate}
				format={(v) => `${v}°`}
				on:change={(e) => {
					run('setRotate', e.detail.value)
				}}
			/>
			<Slider
				label="Scale"
				min={0}
				value={state.value.scale}
				on:change={(e) => {
					run('setScale', e.detail.value)
				}}
			/>
		</DropDownPane>
	</HorizontalButtonGroup>
</ToolbarItem>
