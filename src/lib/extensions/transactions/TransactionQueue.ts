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
	sync?: SyncRequest
}

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
	public commitedQueue: TransactionQueueItem[] = []
	/** Queue of transactions that have been undone and can be redone */
	public undoneQueue: TransactionQueueItem[] = []

	public syncQueue = new SyncQueue()

	constructor(
		public onCommit?: () => void,
		public onUndo?: () => void,
		public onRedo?: () => void,
	) {}

	commit<T, U>(transaction: Transaction<T, U>) {
		// const { target, key } = resolvePropertyPath(transaction.object, transaction.propertyPath)
		const transactionQueueItem: TransactionQueueItem = {
			...transaction,
			historicValue: transaction.read(transaction.object),
		}
		transaction.write(transaction.object, transaction.value)
		this.commitedQueue.push(transactionQueueItem)
		this.undoneQueue = []
		this.onCommit?.()

		if (transaction.sync) {
			this.syncQueue.add(transaction.sync)
		}
	}

	undo() {
		const transaction = this.commitedQueue.pop()
		if (!transaction) return

		// const userData = getThrelteStudioUserData(transaction.object)
		// if (!userData) {
		// 	throw new Error('Cannot commit transaction without inspectorOptions')
		// }

		transaction.write(transaction.object, transaction.historicValue)
		this.undoneQueue.push(transaction)

		// this.syncQueue.add({
		// 	attributeName: transaction.propertyPath,
		// 	attributeValue: transaction.sync
		// 		? transaction.sync(transaction.historicValue)
		// 		: transaction.historicValue,
		// 	componentIndex: 0,
		// 	id: userData.moduleId,
		// 	moduleId: userData.moduleId,
		// 	parserType: 'json',
		// 	signature: userData.signature,
		// })

		this.onUndo?.()
	}

	redo() {
		const transaction = this.undoneQueue.pop()
		if (!transaction) return

		// const userData = getThrelteStudioUserData(transaction.object)
		// if (!userData) {
		// 	throw new Error('Cannot commit transaction without inspectorOptions')
		// }

		transaction.write(transaction.object, transaction.value)
		this.commitedQueue.push(transaction)

		// this.syncQueue.add({
		// 	attributeName: transaction.propertyPath,
		// 	attributeValue: transaction.sync ? transaction.sync(transaction.value) : transaction.value,
		// 	componentIndex: 0,
		// 	id: userData.moduleId,
		// 	moduleId: userData.moduleId,
		// 	parserType: 'json',
		// 	signature: userData.signature,
		// })

		this.onRedo?.()
	}
}
