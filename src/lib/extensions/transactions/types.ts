import type { Transaction } from './TransactionQueue'

export const transactionsScope = 'transactions'

export type TransactionsState = {
	enabled: boolean
	mode: 'auto' | 'manual'
}

export type TransactionsActions = {
	setEnabled: (enabled: boolean) => void
	commit: <T, U, Q>(transaction: Transaction<T, U, Q>) => void
	undo: () => void
	redo: () => void
}
