<script lang="ts">
	import { onDestroy } from 'svelte'
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

	const { addExtension, removeExtension } = useStudio()

	const { run, state } = addExtension<SceneHierarchyState, SceneHierarchyActions>({
		scope: sceneHierarchyScope,
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
		removeExtension(sceneHierarchyScope)
	})

	const enabled = state.select((s) => s.enabled)
</script>

<ToolbarItem position="right">
	<ToolbarButton
		label="Scene Hierarchy"
		icon="mdiFormatListBulletedSquare"
		on:click={() => {
			run('toggleEnabled')
		}}
		active={$enabled}
	/>
</ToolbarItem>

{#if $enabled}
	<Portal>
		<Pane
			title="Scene Hierarchy"
			userExpandable={false}
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
