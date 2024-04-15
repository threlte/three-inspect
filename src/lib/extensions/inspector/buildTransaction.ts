import { resolvePropertyPath } from '@threlte/core'
import type { Transaction } from '../transactions/TransactionQueue'
import { getThrelteStudioUserData } from '../transactions/vite-plugin/runtimeUtils'

export const buildTransaction = (object: any, propertyPath: string, value: any) => {
	const { target, key } = resolvePropertyPath(object, propertyPath)

	const userData = getThrelteStudioUserData(object)

	const transaction: Transaction<any, any> = {
		object,
		value,
		read() {
			if (
				typeof target[key] === 'object' &&
				'clone' in target[key] &&
				typeof target[key].clone === 'function'
			) {
				return target[key].clone()
			}
			return target[key]
		},
		write(_, data) {
			if (
				typeof data === 'object' &&
				'copy' in data &&
				typeof data.copy === 'function' &&
				typeof target[key] === 'object' &&
				'copy' in target[key] &&
				typeof target[key].copy === 'function'
			) {
				target[key].copy(data)
				return
			}
			target[key] = data
		},
		sync: userData
			? {
					attributeName: [...(userData.pathItems ?? []), propertyPath].join('.'),
					componentIndex: userData.index,
					moduleId: userData.moduleId,
					signature: userData.signature,
				}
			: undefined,
	}

	return transaction
}
