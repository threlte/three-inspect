<script lang="ts">
	import { Element, Pane } from 'svelte-tweakpane-ui'
	import Portal from '../../components/Internal/Portal.svelte'
	import ToolbarButton from '../../components/ToolbarButton/ToolbarButton.svelte'
	import ToolbarItem from '../../components/ToolbarItem/ToolbarItem.svelte'
	import { useStudio } from '../../internal/extensions'
	import Tree from './Tree.svelte'
	import {
		sceneHierarchyScope,
		type SceneHierarchyActions,
		type SceneHierarchyState,
	} from './types'

	const { useExtension } = useStudio()

	const { run, state } = useExtension<SceneHierarchyState, SceneHierarchyActions>({
		scope: sceneHierarchyScope,
		state({ persist }) {
			return {
				enabled: persist(true),
			}
		},
		actions: {
			toggleEnabled({ state }) {
				state.enabled = !state.enabled
			},
			setEnabled({ state }, enabled) {
				state.enabled = enabled
			},
		},
		keyMap({ meta }) {
			return {
				toggleEnabled: meta('h'),
			}
		},
	})
</script>

<ToolbarItem position="right">
	<ToolbarButton
		label="Scene Hierarchy"
		icon="mdiFormatListBulletedSquare"
		on:click={() => {
			run('toggleEnabled')
		}}
		active={state.enabled}
	/>
</ToolbarItem>

{#if state.enabled}
	<Portal>
		<Pane
			title="Scene Hierarchy"
			position="fixed"
			y={72}
			x={6}
		>
			<Element>
				<Tree />
			</Element>
		</Pane>
	</Portal>
{/if}
