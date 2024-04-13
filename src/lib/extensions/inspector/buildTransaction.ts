import { resolvePropertyPath } from '@threlte/core'
import type { Transaction } from '../transactions/TransactionQueue'

export const buildTransaction = (object: any, propertyPath: string, value: any) => {
	const { target, key } = resolvePropertyPath(object, propertyPath)

	const transaction: Transaction<any, any> = {
		object,
		value,
		read() {
			if ('clone' in target[key]) {
				return target[key].clone()
			}
			return target[key]
		},
		write(_, data) {
			if ('copy' in data) {
				target[key].copy(data)
				return
			}
			target[key] = data
		},
		// sync: {
		// 	attributeName: propertyPath,
		// 	attributeValue: value,
		// 	parserType: 'json',
		// 	object,
		// },
	}

	return transaction
}
