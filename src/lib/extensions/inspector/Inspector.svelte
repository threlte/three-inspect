<script lang="ts">
	import { onDestroy } from 'svelte'
	import { Pane } from 'svelte-tweakpane-ui'
	import { derived } from 'svelte/store'
	import Portal from '../../components/Internal/Portal.svelte'
	import ToolbarButton from '../../components/ToolbarButton/ToolbarButton.svelte'
	import ToolbarItem from '../../components/ToolbarItem/ToolbarItem.svelte'
	import { browser } from '../../internal/browser'
	import { useStudio } from '../../internal/extensions'
	import { useObjectSelection } from '../object-selection/useObjectSelection'
	import Bindings from './Bindings.svelte'
	import { inspectorScope, type InspectorActions, type InspectorState } from './types'

	const { addExtension, removeExtension } = useStudio()

	const { run, state } = addExtension<InspectorState, InspectorActions>({
		scope: inspectorScope,
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
		removeExtension(inspectorScope)
	})

	const { selectedObjects } = useObjectSelection()

	const title = derived(selectedObjects, (objects) => {
		if (objects.length === 0) return 'Inspector'
		if (objects.length === 1) return `${objects[0].name} (${objects[0].type})`
		return `${objects.length} objects`
	})

	const enabled = state.select((s) => s.enabled)
</script>

<ToolbarItem position="right">
	<ToolbarButton
		label="Inspector"
		icon="mdiPencil"
		on:click={() => {
			run('toggleEnabled')
		}}
		active={$enabled}
	/>
</ToolbarItem>

{#if $enabled && $selectedObjects.length > 0}
	<Portal>
		<Pane
			title={$title}
			position="fixed"
			width={320}
			x={browser ? innerWidth - 6 - 320 : 6}
			y={6 + 60 + 6}
		>
			<Bindings />
		</Pane>
	</Portal>
{/if}
