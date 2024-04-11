<script lang="ts">
	import { Pane } from 'svelte-tweakpane-ui'
	import Portal from '../../components/Internal/Portal.svelte'
	import ToolbarButton from '../../components/ToolbarButton/ToolbarButton.svelte'
	import ToolbarItem from '../../components/ToolbarItem/ToolbarItem.svelte'
	import { browser } from '../../internal/browser'
	import { useStudio } from '../../internal/extensions'
	import { useObjectSelection } from '../object-selection/useObjectSelection.svelte'
	import Bindings from './Bindings.svelte'
	import { inspectorScope, type InspectorActions, type InspectorState } from './types'

	const { useExtension } = useStudio()

	const { run, state } = useExtension<InspectorState, InspectorActions>({
		scope: inspectorScope,
		state({ persist }) {
			return {
				enabled: persist(true),
			}
		},
		actions: {
			setEnabled({ state }, enabled) {
				state.enabled = enabled
			},
			toggleEnabled({ state }) {
				state.enabled = !state.enabled
			},
		},
	})

	const objectSelection = useObjectSelection()

	const title = $derived.by(() => {
		if (objectSelection.selectedObjects.length === 0) return 'Inspector'
		if (objectSelection.selectedObjects.length === 1)
			return `${objectSelection.selectedObjects[0].name} (${objectSelection.selectedObjects[0].type})`
		return `${objectSelection.selectedObjects.length} objects`
	})
</script>

<ToolbarItem position="right">
	<ToolbarButton
		label="Inspector"
		icon="mdiPencil"
		on:click={() => {
			run('toggleEnabled')
		}}
		active={state.enabled}
	/>
</ToolbarItem>

{#if state.enabled && objectSelection.selectedObjects.length > 0}
	<Portal>
		<Pane
			{title}
			position="fixed"
			width={320}
			x={browser ? innerWidth - 6 - 320 : 6}
			y={6 + 60 + 6}
		>
			<Bindings />
		</Pane>
	</Portal>
{/if}
