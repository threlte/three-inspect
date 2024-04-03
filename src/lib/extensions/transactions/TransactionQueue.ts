/* eslint-disable max-classes-per-file */

export type TransactionConstructorParams<T, U> = [
	root: T,
	data: U,
	read: (root: T) => U,
	write: (root: T, data: U) => void,
]

export class Transaction<T, U> {
	public dataBefore: U

	constructor(
		private root: TransactionConstructorParams<T, U>[0],
		private data: TransactionConstructorParams<T, U>[1],
		private read: TransactionConstructorParams<T, U>[2],
		private write: TransactionConstructorParams<T, U>[3],
	) {
		this.dataBefore = this.read(this.root)
	}

	commit() {
		this.write(this.root, this.data)
	}

	undo() {
		this.write(this.root, this.dataBefore)
	}
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
	public commitedQueue: Transaction<any, any>[] = []
	/** Queue of transactions that have been undone and can be redone */
	public undoneQueue: Transaction<any, any>[] = []

	constructor(
		public onCommit?: () => void,
		public onUndo?: () => void,
		public onRedo?: () => void,
	) {}

	commit<T, U>(...args: TransactionConstructorParams<T, U>) {
		const transaction = new Transaction(...args)
		transaction.commit()
		this.commitedQueue.push(transaction)
		this.undoneQueue = []
		this.onCommit?.()
	}

	undo() {
		const transaction = this.commitedQueue.pop()
		if (!transaction) return
		transaction.undo()
		this.undoneQueue.push(transaction)
		this.onUndo?.()
	}

	redo() {
		const transaction = this.undoneQueue.pop()
		if (!transaction) return
		transaction.commit()
		this.commitedQueue.push(transaction)
		this.onRedo?.()
	}
}
