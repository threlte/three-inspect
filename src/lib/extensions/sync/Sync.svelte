<script lang="ts">
	import { injectPlugin } from '@threlte/core'
	import { onDestroy } from 'svelte'
	import { useStudio } from '../../internal/extensions'
	import { TransactionQueue } from './TransactionQueue'
	import { syncScope, type SyncActions, type SyncState } from './types'

	const { addExtension, removeExtension } = useStudio()

	const queue = new TransactionQueue()

	addExtension<SyncState, SyncActions>({
		scope: syncScope,
		state: ({ persist }) => {
			return {
				enabled: persist<boolean>(true),
				mode: persist<'auto' | 'manual'>('auto'),
			}
		},
		actions: {
			setEnabled({ select }, enabled) {
				select((s) => s.enabled).set(enabled)
			},
			commit(_, object, value, read, write) {
				queue.commit(object, value, read, write)
			},
			undo() {
				queue.undo()
			},
			redo() {
				queue.redo()
			},
		},
		keyMap({ meta, shift }) {
			return {
				undo: meta('z'),
				redo: shift(meta('z')),
			}
		},
	})

	onDestroy(() => {
		removeExtension(syncScope)
	})

	injectPlugin('sync', ({ ref, props }) => {
		if (props.threlteStudio) {
			ref.userData.threlteStudio = props.threlteStudio
		}
		return {
			pluginProps: ['threlteStudio'],
		}
	})
</script>

<slot />
