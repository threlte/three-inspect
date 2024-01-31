import { currentWritable } from '@threlte/core'

export type BaseTransaction = {
	id: string
	time: number
}

export type Upsert = BaseTransaction & {
	type: 'upsert'
	fileId: string
	componentIndex: number
	propertyPath: string[]
	propertyValue: unknown
}

export type Delete = BaseTransaction & {
	type: 'delete'
	fileId: string
	componentIndex: number
	propertyPath: string[]
}

export type Read = BaseTransaction & {
	type: 'read'
	fileId: string
	componentIndex: number
	propertyPath: string[]
}

export type Transaction = Upsert | Delete | Read

type TransactionArgument<T extends Transaction> = Omit<Transaction, 'id' | 'time' | 'type'>

const getBaseTransaction = (): BaseTransaction => {
	return {
		id: Math.random().toString(36).slice(2, 9),
		time: Date.now(),
	}
}

export const createTransactionsStore = () => {
	const transactions = currentWritable<Transaction[]>([])

	const addUpsert = (t: TransactionArgument<Upsert>) => {
    const baseTransaction = getBaseTransaction()

    transactions.update((ts) => {
      ts.push({
        ...baseTransaction,
        
      })
      return ts
    })
  }
}
