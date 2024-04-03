import { resolvePropertyPath } from '@threlte/core'

const isObject = (value: unknown): value is Record<string, any> => {
	return typeof value === 'object' && value !== null
}

type PropertyPathResult = {
	target: any
	key: string | symbol
}

/**
 * Function to detect the access path of a property by recursively providing a
 * proxy object that intercepts the get operation.
 */
const detectPropertyPath = (target: any, selectorFn: (target: any) => any): PropertyPathResult => {
	const path: PropertyPathResult[] = [{ target, key: '' }]
	const proxy = new Proxy(
		{},
		{
			get(_: any, key: string | symbol): any {
				path.push({
					key,
					target: path.at(-1)?.target[key],
				})
				return proxy
			},
		},
	)
	// Execute the selector function with the proxy
	selectorFn(proxy)
	// Return the last accessed property information
	return {
		key: path.at(-1)!.key,
		target: path.at(-2)?.target,
	}
}

export class Transaction<T, U> {
	public target: Record<string | symbol, any> | null
	public key: string | symbol

	public valueBefore: unknown

	constructor(
		public object: T,
		public property: ((object: T) => U) | string,
		public value: unknown,
	) {
		if (typeof property === 'string') {
			const { target, key } = resolvePropertyPath(object, property)
			this.target = target
			this.key = key
			this.valueBefore = target[key]
		} else {
			const { key, target } = detectPropertyPath(object, property)
			this.target = target
			this.key = key
			this.valueBefore = target[key]
		}
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
}
