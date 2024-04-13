import { useStudio } from '../../internal/extensions'
import type { Transaction } from './TransactionQueue'
import { transactionsScope, type TransactionsActions, type TransactionsState } from './types'

export const useTransactions = () => {
	const { getExtension } = useStudio()

	const { run } = getExtension<TransactionsState, TransactionsActions>(transactionsScope)

	const commit = <T, U>(transaction: Transaction<T, U>) => {
		run('commit', transaction as any)
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
