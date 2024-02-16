import { immerStore, type ImmerStore, type SubImmerStore } from 'svelte-immer-store'
import { get } from 'svelte/store'
import { scopeId } from './scopeUtils'
import { enableMapSet } from 'immer'

enableMapSet()

// Persistance
const persist = {
	regular: <T>(value: T): T => {
		return value
	},
	dummy: <T>(): T => {
		return '__threlte-studio-persisted-value__' as unknown as T
	},
}

const persistedDummyValue = '__threlte-studio-persisted-value__'

const isObject = (d: any): d is Record<string, any> => {
	return typeof d === 'object' && !Array.isArray(d) && d !== null
}

const getPersistedPaths = function (obj: Record<string, unknown>, prefix?: string) {
	const keys = Object.keys(obj)
	// eslint-disable-next-line no-param-reassign
	prefix = prefix ? `${prefix}.` : ''
	return keys.reduce<string[]>((result, key) => {
		if (isObject(obj[key])) {
			// eslint-disable-next-line no-param-reassign
			result = [...result, ...getPersistedPaths(obj[key] as Record<string, unknown>, prefix + key)]
		} else if (obj[key] === persistedDummyValue) {
			result.push(prefix + key)
		}
		return result
	}, [])
}

export const createState = () => {
	const state = immerStore<Record<string, Record<string, unknown>>>({})

	// the key is the scope and the value is the path to the persisted state
	const persistedStatePaths: Record<string, string[]> = {}

	const addExtensionState = <T extends Record<string, unknown>>(
		scope: string,
		createState: (args: { persist: <U>(value: U) => U }) => T,
	): ImmerStore<T> => {
		const extensionState = createState({ persist: persist.regular })
		const persistedState = createState({ persist: persist.dummy })
		const persistedPaths = getPersistedPaths(persistedState)

		persistedStatePaths[scope] = persistedPaths

		for (const path of persistedPaths) {
			const scopedKey = scopeId(scope, path)
			const stringValue = localStorage[scopedKey] as string | undefined
			if (stringValue) {
				const parsedValue = JSON.parse(stringValue) as unknown
				const pathParts = path.split('.')
				const lastPart = pathParts.pop()
				if (!lastPart) {
					throw new Error(`Path "${path}" is not valid`)
				}
				let value: unknown = extensionState
				for (const pathPart of pathParts) {
					if (!isObject(value)) {
						throw new Error(`Path "${path}" is not valid`)
					}
					value = value[pathPart]
				}
				if (!isObject(value)) {
					throw new Error(`Path "${path}" is not valid`)
				}
				value[lastPart] = parsedValue
			}
		}

		state.update((s) => {
			s[scope] = extensionState
			return s
		})
		return state.select((s) => s[scope]) as ImmerStore<T>
	}

	const getScopedState = <T extends Record<string, unknown>>(scope: string): SubImmerStore<T> => {
		return state.select((s) => s[scope]) as SubImmerStore<T>
	}

	/**
	 * This function is used to get a readable state for a specific scope. It is
	 * used to pass the state to components that should not be able to modify the
	 * state. The returned state is a readable store and can be used in Svelte
	 * components, be aware that it is only readable as long as you don't spy
	 * further into the state with `select`.
	 * @param scope
	 * @returns A readable state for the given scope
	 */
	const getScopedReadableState = <T extends Record<string, unknown>>(
		scope: string,
	): Pick<SubImmerStore<T>, 'subscribe' | 'select'> => {
		return state.select((s) => s[scope]) as SubImmerStore<T>
	}

	const removeScopedState = (scope: string): void => {
		const subtree = state.select((s) => s[scope])
		subtree.delete()
	}

	const persistState = () => {
		for (const [scope, paths] of Object.entries(persistedStatePaths)) {
			const state = getScopedState(scope)
			for (const path of paths) {
				const scopedKey = scopeId(scope, path)
				const pathParts = path.split('.')
				const value = get(
					state.select((s) => {
						let value: unknown = s
						for (const pathPart of pathParts) {
							if (!isObject(value)) {
								throw new Error(`Path "${path}" is not valid`)
							}
							value = value[pathPart]
						}
						return value
					}),
				)
				localStorage[scopedKey] = JSON.stringify(value)
			}
		}
	}

	return {
		addExtensionState,
		getScopedState,
		getScopedReadableState,
		removeScopedState,
		persistState,
		state,
	}
}
