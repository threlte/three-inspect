import type { SubImmerStore } from 'svelte-immer-store'
import type { ExtensionAction, ExtensionActions } from './types'

export const createActions = () => {
	const actions = new Map<string, ExtensionActions<Record<string, any>>>()

	const addExtensionActions = (scope: string, extensionActions: ExtensionActions<any>) => {
		actions.set(scope, extensionActions)
	}

	const removeExtensionActions = (scope: string) => {
		actions.delete(scope)
	}

	const runAction = (
		scope: string,
		actionId: string,
		state: SubImmerStore<any>,
		record: () => void,
		...args: any[]
	) => {
		if (!actions.has(scope)) {
			console.warn(`Extension with scope "${scope}" does not exist`)
			return undefined
		}

		const extensionActions = actions.get(scope)!

		if (!(actionId in extensionActions)) {
			console.warn(`Action with id "${actionId.toString()}" does not exist in scope "${scope}"`)
			return undefined
		}

		const action = extensionActions[actionId]

		const selectProxy = (...args: Parameters<SubImmerStore<any>['select']>) => {
			return state.select(...args)
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		return action(
			{ select: selectProxy as Parameters<ExtensionAction<any>>[0]['select'], record },
			...args,
		)
	}

	return {
		addExtensionActions,
		removeExtensionActions,
		runAction,
	}
}
