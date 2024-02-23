<script lang="ts">
	import { onDestroy } from 'svelte'
	import { get } from 'svelte/store'
	import ToolbarButton from '../../components/ToolbarButton/ToolbarButton.svelte'
	import ToolbarItem from '../../components/ToolbarItem/ToolbarItem.svelte'
	import HorizontalButtonGroup from '../../components/Tools/HorizontalButtonGroup.svelte'
	import { useStudio } from '../../internal/extensions'
	import RenderSelectedObjects from './RenderSelectedObjects.svelte'
	import SelectRect from './SelectRect.svelte'
	import SelectTweak from './SelectTweak.svelte'
	import {
		objectSelectionScope,
		type ObjectSelectionActions,
		type ObjectSelectionState,
	} from './types'

	const { addExtension, removeExtension } = useStudio()

	const { state, run } = addExtension<ObjectSelectionState, ObjectSelectionActions>({
		scope: objectSelectionScope,
		state: ({ persist }) => ({
			selectedObjects: [],
			enabled: persist(false),
			mode: 'tweak',
			inUse: false,
		}),
		actions: {
			selectObjects({ select, record }, objects) {
				record(() => select((s) => s.selectedObjects).set(objects))
			},
			clearSelection({ select, record }) {
				record(() => select((s) => s.selectedObjects).set([]))
			},
			addToSelection({ select, record }, objects) {
				record(() => {
					select((s) => s.selectedObjects).update((selectedObjects) => {
						const newObjects = objects.filter((object) => !selectedObjects.includes(object))
						return [...selectedObjects, ...newObjects]
					})
				})
			},
			removeFromSelection({ select, record }, objects) {
				record(() => {
					select((s) => s.selectedObjects).update((selectedObjects) => {
						return selectedObjects.filter((object) => !objects.includes(object))
					})
				})
			},
			toggleSelection({ select, record }, objects) {
				record(() => {
					select((s) => s.selectedObjects).update((selectedObjects) => {
						objects.forEach((object) => {
							const index = selectedObjects.indexOf(object)
							if (index === -1) {
								selectedObjects.push(object)
							} else {
								selectedObjects.splice(index, 1)
							}
						})
						return selectedObjects
					})
				})
			},
			toggleEnabled({ select }) {
				select((s) => s.enabled).update((enabled) => !enabled)
			},
			setEnabled({ select }, enabled) {
				select((s) => s.enabled).set(enabled)
			},
			setMode({ select }, mode) {
				select((s) => s.mode).set(mode)
				if (mode === 'tweak') select((s) => s.inUse).set(false)
			},
			toggleMode({ select }) {
				const mode = select((s) => s.mode)
				mode.update((mode) => {
					return mode === 'tweak' ? 'rect' : 'tweak'
				})
				if (get(mode) === 'tweak') select((s) => s.inUse).set(false)
			},
			setInUse({ select }, inUse) {
				select((s) => s.inUse).set(inUse)
			},
			setModeTweak({ select }) {
				select((s) => s.mode).set('tweak')
			},
			setModeRect({ select }) {
				select((s) => s.mode).set('rect')
			},
		},
		keyMap() {
			return {
				toggleMode: 'a',
			}
		},
	})

	onDestroy(() => {
		removeExtension(objectSelectionScope)
	})

	const mode = state.select((s) => s.mode)
</script>

{#if $mode === 'tweak'}
	<SelectTweak />
{:else if $mode === 'rect'}
	<SelectRect />
{/if}

<RenderSelectedObjects />

<ToolbarItem>
	<HorizontalButtonGroup>
		<ToolbarButton
			label="Select Tweak"
			on:click={() => {
				run('setMode', 'tweak')
			}}
			active={$mode === 'tweak'}
			icon="mdiCursorPointer"
			tooltip="Tweak Selection (A)"
		/>

		<ToolbarButton
			label="Select Box"
			on:click={() => {
				run('setMode', 'rect')
			}}
			active={$mode === 'rect'}
			icon="mdiSelect"
			tooltip="Box Selection (A)"
		/>
	</HorizontalButtonGroup>
</ToolbarItem>
