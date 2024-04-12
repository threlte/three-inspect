<script lang="ts">
	import { injectPlugin, useThrelte } from '@threlte/core'
	import { useStudio } from '../../internal/extensions'
	import { TransactionQueue } from './TransactionQueue'
	import { transactionsScope, type TransactionsActions, type TransactionsState } from './types'

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
