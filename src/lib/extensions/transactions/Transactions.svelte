<script lang="ts">
	import { injectPlugin, useThrelte } from '@threlte/core'
	import { useStudio } from '../../internal/extensions'
	import { TransactionQueue } from './TransactionQueue'
	import { transactionsScope, type TransactionsActions, type TransactionsState } from './types'
	import type { StudioProps } from './vite-plugin/types'
	import { onMount } from 'svelte'

	const { useExtension } = useStudio()
	const { invalidate } = useThrelte()

	const queue = new TransactionQueue()

	useExtension<TransactionsState, TransactionsActions>({
		scope: transactionsScope,
		state: ({ persist }) => {
			return {
				enabled: persist<boolean>(true),
				mode: persist<'auto' | 'manual'>('auto'),
			}
		},
		actions: {
			setEnabled({ state }, enabled) {
				state.enabled = enabled
			},
			commit(_, transaction) {
				queue.commit(transaction)
				invalidate()
			},
			undo() {
				queue.undo()
				invalidate()
			},
			redo() {
				queue.redo()
				invalidate()
			},
		},
		keyMap({ meta, shift }) {
			return {
				undo: meta('z'),
				redo: shift(meta('z')),
			}
		},
	})

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
</script>

<slot />
