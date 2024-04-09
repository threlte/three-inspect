<script lang="ts">
	import { onDestroy } from 'svelte'
	import { useStudio } from '../../internal/extensions'
	import { type SpaceActions, type SpaceState, spaceScope } from './types'
	import ToolbarItem from '../../components/ToolbarItem/ToolbarItem.svelte'
	import ToolbarButton from '../../components/ToolbarButton/ToolbarButton.svelte'
	import HorizontalButtonGroup from '../../components/Tools/HorizontalButtonGroup.svelte'

	const { addExtension, removeExtension } = useStudio()

	const { state, run } = addExtension<SpaceState, SpaceActions>({
		scope: spaceScope,
		state() {
			return {
				space: 'local',
			}
		},
		actions: {
			setSpace({ state }, space) {
				state.value.space = space
			},
			toggleSpace({ state }) {
				state.value.space = state.value.space === 'local' ? 'world' : 'local'
			},
		},
		keyMap() {
			return {
				toggleSpace: 'w',
			}
		},
	})

	onDestroy(() => {
		removeExtension(spaceScope)
	})
</script>

<ToolbarItem>
	<HorizontalButtonGroup>
		<ToolbarButton
			active={state.value.space === 'local'}
			icon="mdiAxisArrow"
			label="Local"
			tooltip="Local (W)"
			on:click={() => {
				run('setSpace', 'local')
			}}
		/>
		<ToolbarButton
			active={state.value.space === 'world'}
			icon="mdiEarth"
			label="World"
			tooltip="World (W)"
			on:click={() => {
				run('setSpace', 'world')
			}}
		/>
	</HorizontalButtonGroup>
</ToolbarItem>
