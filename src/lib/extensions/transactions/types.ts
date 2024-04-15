import type { TransactionQueueCommitArgs } from './TransactionQueue'

export const transactionsScope = 'transactions'

export type TransactionsState = {
	enabled: boolean
	mode: 'auto' | 'manual'
}

export type TransactionsActions = {
	setEnabled: (enabled: boolean) => void
	commit: (transactions: TransactionQueueCommitArgs) => void
	undo: () => void
	redo: () => void
}
