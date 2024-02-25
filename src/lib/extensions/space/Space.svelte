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
		state({ persist }) {
			return {
				space: persist('local'),
			}
		},
		actions: {
			setSpace({ select }, space) {
				select((s) => s.space).set(space)
			},
			toggleSpace({ select }) {
				select((s) => s.space).update((space) => {
					return space === 'local' ? 'world' : 'local'
				})
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

	const space = state.select((s) => s.space)
</script>

<ToolbarItem>
	<HorizontalButtonGroup>
		<ToolbarButton
			active={$space === 'local'}
			icon="mdiAxisArrow"
			label="Local"
			tooltip="Local (W)"
			on:click={() => {
				run('setSpace', 'local')
			}}
		/>
		<ToolbarButton
			active={$space === 'world'}
			icon="mdiEarth"
			label="World"
			tooltip="World (W)"
			on:click={() => {
				run('setSpace', 'world')
			}}
		/>
	</HorizontalButtonGroup>
</ToolbarItem>
