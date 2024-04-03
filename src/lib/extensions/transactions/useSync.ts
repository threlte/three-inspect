import { useStudio } from '../../internal/extensions'
import type { TransactionArgs } from './TransactionQueue'
import { syncScope, type SyncActions, type SyncState } from './types'

export const useSync = () => {
	const { getExtension } = useStudio()

	const { run } = getExtension<SyncState, SyncActions>(syncScope)

	const commit = <T, U>(...args: TransactionArgs<T, U>) => {
		run('commit', ...(args as TransactionArgs<unknown, unknown>))
	}

	const undo = () => {
		run('undo')
	}

	const redo = () => {
		run('redo')
	}

	return {
		commit,
		undo,
		redo,
	}
}
