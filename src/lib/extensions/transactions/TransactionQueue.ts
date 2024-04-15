/* eslint-disable max-classes-per-file */

import { SyncQueue, type SyncRequest } from './SyncQueue'

export type Transaction<T, U> = {
	/** The object to modify */
	object: T
	/** The value of the transaction */
	value: U
	/** Read from the object into a serializable format */
	read: (root: T) => U
	/** Write a value on the object from the format resolved by the read property */
	write: (root: T, data: U) => void
	/** The sync configuration */
	sync?: Omit<SyncRequest, 'attributeValue'>
}

export type TransactionQueueCommitArgs = Transaction<any, any>[]

type TransactionQueueItem = Transaction<any, any> & {
	historicValue: any
}

/**
 * The TransactionQueue class is a queue of transactions that can be undone and
 * redone. A transaction is a change to a value that can be undone and redone.
 * The root of a transaction as well as the data is completely arbitrary.
 *
 * ### Committing a transaction
 *
 * To commit a transaction, you must provide the root object, the data to write,
 * a function to read the data from the root object, and a function to write the
 * data to the root object.
 *
 * @example
 * Single object in single commit
 * ```ts
 * const obj = {
 *   foo: {
 * 		 bar: 'baz',
 * 	 },
 * }
 *
 * const transactionQueue = new TransactionQueue()
 * transactionQueue.commit(
 *   obj,
 *   'quo',
 *   (obj) => obj.foo.bar,
 *   (obj, value) => (obj.foo.bar = value),
 * )
 *
 * expect(obj.foo.bar).toBe('quo')
 * ```
 *
 * @example
 * Multiple objects in single commit
 * ```ts
 * const arr = [{ foo: 'bar' }, { foo: 'baz' }]
 *
 * const transactionQueue = new TransactionQueue()
 * transactionQueue.commit(
 *   arr,
 *   arr.map(() => 'qux'),
 *   (arr) => arr.map((obj) => obj.foo),
 *   (arr, data) => arr.forEach((obj, i) => (obj.foo = data[i])),
 * )
 *
 * expect(arr[0].foo).toBe('qux')
 * expect(arr[1].foo).toBe('qux')
 * ```
 */
export class TransactionQueue {
	/** Queue of transactions that have been commited and can be undone */
	public commitedQueue: TransactionQueueItem[][] = []
	/** Queue of transactions that have been undone and can be redone */
	public undoneQueue: TransactionQueueItem[][] = []

	public syncQueue = new SyncQueue()

	constructor(
		public onCommit?: () => void,
		public onUndo?: () => void,
		public onRedo?: () => void,
	) {}

	commit(transactions: TransactionQueueCommitArgs) {
		const transactionQueueItems: TransactionQueueItem[] = transactions.map((transaction) => {
			return {
				...transaction,
				historicValue: transaction.read(transaction.object),
			}
		})
		transactions.forEach((transaction) => {
			transaction.write(transaction.object, transaction.value)
		})

		this.commitedQueue.push(transactionQueueItems)
		this.undoneQueue = []
		this.onCommit?.()

		transactions.forEach((transaction) => {
			if (transaction.sync) {
				this.syncQueue.add({
					...transaction.sync,
					attributeValue: transaction.value,
				})
			}
		})
	}

	undo() {
		const transactions = this.commitedQueue.pop()
		if (!transactions) return

		transactions.forEach((transaction) => {
			transaction.write(transaction.object, transaction.historicValue)
		})

		this.undoneQueue.push(transactions)
		this.onUndo?.()

		transactions.forEach((transaction) => {
			if (transaction.sync) {
				this.syncQueue.add({
					...transaction.sync,
					attributeValue: transaction.historicValue,
				})
			}
		})
	}

	redo() {
		const transactions = this.undoneQueue.pop()
		if (!transactions) return

		transactions.forEach((transaction) => {
			transaction.write(transaction.object, transaction.value)
		})

		this.commitedQueue.push(transactions)
		this.onRedo?.()

		transactions.forEach((transaction) => {
			if (transaction.sync) {
				this.syncQueue.add({
					...transaction.sync,
					attributeValue: transaction.value,
				})
			}
		})
	}
}
