import { useStudio } from '../../internal/extensions'
import type { TransactionQueueCommitArgs } from './TransactionQueue.svelte'
import { transactionsScope, type TransactionsActions, type TransactionsState } from './types'

export const useTransactions = () => {
	const { getExtension } = useStudio()

	const { run } = getExtension<TransactionsState, TransactionsActions>(transactionsScope)

	const commit = (transactions: TransactionQueueCommitArgs) => {
		run('commit', transactions)
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
