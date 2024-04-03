import { useStudio } from '../../internal/extensions'
import type { TransactionConstructorParams } from './TransactionQueue'
import { syncScope, type SyncActions, type SyncState } from './types'

export const useSync = () => {
	const { getExtension } = useStudio()

	const { run } = getExtension<SyncState, SyncActions>(syncScope)

	const commit = <T, U>(...args: TransactionConstructorParams<T, U>) => {
		run('commit', ...(args as TransactionConstructorParams<unknown, unknown>))
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
