import { resolvePropertyPath } from '@threlte/core'

const isObject = (value: unknown): value is Record<string, any> =>
	typeof value === 'object' && value !== null

export class Transaction {
	public target: unknown
	public key: string

	constructor(
		public object: unknown,
		public propertyPath: string,
		public value: unknown,
		public valueBefore: unknown,
	) {
		const { target, key } = Transaction.resolvePath(object, propertyPath)
		this.target = target
		this.key = key
	}

	static resolvePath(object: any, propertyPath: string): { target: unknown; key: string } {
		return resolvePropertyPath(object, propertyPath)
	}

	commit() {
		if (!this.target) return
		if (typeof this.target !== 'object') return
		if (!this.key) return
		if (!isObject(this.target)) return
		this.target[this.key] = this.value
	}

	undo() {
		if (!this.target) return
		if (typeof this.target !== 'object') return
		if (!this.key) return
		if (!isObject(this.target)) return
		this.target[this.key] = this.valueBefore
	}

	stringify(): string {
		return JSON.stringify({
			propertyPath: this.propertyPath,
			value: this.value,
			valueBefore: this.valueBefore,
		})
	}

	static parse(object: any, string: string): Transaction {
		const data = JSON.parse(string) as {
			object: any
			propertyPath: string
			value: any
			valueBefore: any
		}
		return new Transaction(object, data.propertyPath, data.value, data.valueBefore)
	}
}
