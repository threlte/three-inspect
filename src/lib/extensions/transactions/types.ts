import type { TransactionArgs } from './TransactionQueue'

export const transactionsScope = 'transactions'

export type TransactionsState = {
	enabled: boolean
	mode: 'auto' | 'manual'
}

export type TransactionsActions = {
	setEnabled: (enabled: boolean) => void
	commit: <T, U>(...args: TransactionArgs<T, U>) => void
	undo: () => void
	redo: () => void
}

export type ServerFunctions = {}

export type ClientFunctions = {}
