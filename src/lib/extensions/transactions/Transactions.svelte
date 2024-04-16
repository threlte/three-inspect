<script lang="ts">
	import { injectPlugin, useThrelte } from '@threlte/core'
	import { onMount } from 'svelte'
	import { Checkbox, RadioGrid, Element } from 'svelte-tweakpane-ui'
	import DropDownPane from '../../components/DropDownPane/DropDownPane.svelte'
	import ToolbarButton from '../../components/ToolbarButton/ToolbarButton.svelte'
	import ToolbarItem from '../../components/ToolbarItem/ToolbarItem.svelte'
	import HorizontalButtonGroup from '../../components/Tools/HorizontalButtonGroup.svelte'
	import { useStudio } from '../../internal/extensions'
	import { TransactionQueue } from './TransactionQueue.svelte'
	import { transactionsScope, type TransactionsActions, type TransactionsState } from './types'
	import type { StudioProps } from './vite-plugin/types'
	import Changes from './Changes.svelte'

	const { useExtension } = useStudio()
	const { invalidate } = useThrelte()

	const applyToProperties = ['shadow', 'light', 'material', 'camera']

	const insertStudioProps = (object: any, props: StudioProps) => {
		for (const key of Object.keys(object)) {
			if (applyToProperties.includes(key)) {
				const newProps: StudioProps = {
					...props,
					pathItems: [...(props.pathItems ?? []), key],
				}
				const hasUserData = 'userData' in object[key]
				const hasInspectorOptions = hasUserData && 'threlteStudio' in object[key].userData
				if (!hasInspectorOptions) {
					if (hasUserData) {
						object[key].userData.threlteStudio = newProps
					} else {
						object[key]['userData'] = { threlteStudio: newProps }
					}
				}
				insertStudioProps(object[key], newProps)
			}
		}
	}

	injectPlugin<{
		threlteStudio: StudioProps
	}>('sync', ({ ref, props }) => {
		if (!props.threlteStudio) return

		ref.userData.threlteStudio = props.threlteStudio

		// go through the properties and apply the studio props to the properties
		// that are in the applyToProperties array
		onMount(() => {
			insertStudioProps(ref, props.threlteStudio)
		})
		return {
			pluginProps: ['threlteStudio'],
		}
	})

	const { run, state } = useExtension<TransactionsState, TransactionsActions>({
		scope: transactionsScope,
		state: ({ persist }) => {
			return {
				enabled: persist<boolean>(true),
				mode: persist<'auto' | 'manual'>('auto'),
				precision: persist<number>(4),
				queue: new TransactionQueue(),
			}
		},
		actions: {
			toggleEnabled({ state }) {
				state.enabled = !state.enabled
			},
			setEnabled({ state }, enabled) {
				state.enabled = enabled
			},
			setMode({ state }, mode) {
				state.mode = mode
			},
			setPrecision({ state }, precision) {
				state.precision = precision
			},
			commit({ state }, transaction) {
				state.queue.commit(transaction)
				invalidate()
			},
			undo({ state }) {
				state.queue.undo()
				invalidate()
			},
			redo({ state }) {
				state.queue.redo()
				invalidate()
			},
			sync({ state }) {
				state.queue.sync()
			},
		},
		keyMap({ meta, shift }) {
			return {
				undo: meta('z'),
				redo: shift(meta('z')),
			}
		},
	})

	$effect(() => {
		if (state.enabled && state.mode === 'auto' && state.queue.syncQueue.length) {
			run('sync')
		}
	})
</script>

<ToolbarItem position="right">
	<HorizontalButtonGroup>
		<ToolbarButton
			success={state.enabled && state.mode === 'auto'}
			warn={state.enabled && state.mode === 'manual' && state.queue.syncQueue.length > 0}
			disabled={!state.enabled}
			icon="mdiContentSave"
			label="Sync"
			tooltip="Sync"
			on:click={() => {
				run('sync')
			}}
		/>

		<DropDownPane title="Sync Settings">
			<Checkbox
				label="Enabled"
				value={state.enabled}
				on:change={(e) => {
					run('setEnabled', e.detail.value)
				}}
			/>
			<RadioGrid
				label="Mode"
				columns={2}
				values={['manual', 'auto']}
				on:change={(e) => {
					run('setMode', e.detail.value as 'manual' | 'auto')
				}}
				value={state.mode}
			/>

			<Element>
				<Changes />
			</Element>
		</DropDownPane>
	</HorizontalButtonGroup>
</ToolbarItem>

<slot />
