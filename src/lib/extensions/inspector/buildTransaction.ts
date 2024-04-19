import { resolvePropertyPath } from '@threlte/core'
import type { Transaction } from '../transactions/TransactionQueue.svelte'
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
				target[key] !== null &&
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
				data !== null &&
				'copy' in data &&
				typeof data.copy === 'function' &&
				typeof target[key] === 'object' &&
				target[key] !== null &&
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
