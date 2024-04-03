import type { TransactionConstructorParams } from './TransactionQueue'
import type { ParserType } from './utils/parsers'

export const syncScope = 'sync'

export type SyncState = {
	enabled: boolean
	mode: 'auto' | 'manual'
}

export type SyncActions = {
	setEnabled: (enabled: boolean) => void
	commit: <T, U>(...args: TransactionConstructorParams<T, U>) => void
	undo: () => void
	redo: () => void
}

/**
 * A transaction is a change to a component's markup.
 */
export type Transaction = {
	/** The unique id of the transaction */
	transactionId: string
	/** The id of the module the component is in */
	moduleId: string
	/** The name of the T component instance */
	componentName: string
	/** The attribute name */
	attributeName: string
	/** The parser to parse and stringify the value */
	parserType: ParserType
	/** Historic value of the property */
	from: any
	/** The value to set the attribute to */
	to: any
}

export type TransactionResponse = {
	transactionId: string
	success: boolean
}

export type ServerFunctions = {
	isPrepared(moduleId: string): boolean
	prepare(moduleId: string): void
	transaction(transaction: Transaction): TransactionResponse
}

export type ClientFunctions = Record<string, never>
