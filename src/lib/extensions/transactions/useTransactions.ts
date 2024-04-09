import { useStudio } from '../../internal/extensions.svelte'
import type { Transaction } from './TransactionQueue'
import { transactionsScope, type TransactionsActions, type TransactionsState } from './types'

export const useTransactions = () => {
	const { getExtension } = useStudio()

	const { run } = getExtension<TransactionsState, TransactionsActions>(transactionsScope)

	const commit = <T, U, Q>(transaction: Transaction<T, U, Q>) => {
		run('commit', transaction)
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
