import { currentWritable } from '@threlte/core'
import { getContext, setContext, SvelteComponent } from 'svelte'
import { get, type Readable, type Writable } from 'svelte/store'
import { browser } from './browser'
import { createKeyboardControls, flattenKeyCombo, formatKeyCombo, hotkeyFns } from './keyboard'
import { scopeId } from './scopeUtils'
import { subStore } from './subStore'
import { setAutoFreeze } from 'immer'

setAutoFreeze(false)

type RecordUnknown = Record<symbol, unknown> | Readonly<Record<number, unknown>>

type SelectExtensionState<ExtensionState extends RecordUnknown> = <U>(
	selector: (s: ExtensionState) => U,
) => Writable<U>

type ExtensionAction = <ExtensionState extends Record<string, any>>(
	utils: {
		select: SelectExtensionState<ExtensionState>
	},
	...args: any[]
) => Promise<void> | void

type ExtensionActions = Record<string, ExtensionAction>

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

const isObject = (d: any): d is object => {
	return typeof d === 'object' && !Array.isArray(d) && d !== null
}

const getPersistedPaths = function (obj: Record<string, unknown>, prefix?: string) {
	const keys = Object.keys(obj)
	prefix = prefix ? `${prefix}.` : ''
	return keys.reduce<string[]>((result, key) => {
		if (isObject(obj[key])) {
			result = [...result, ...getPersistedPaths(obj[key] as Record<string, unknown>, prefix + key)]
		} else if (obj[key] === persistedDummyValue) {
			result.push(prefix + key)
		}
		return result
	}, [])
}

export const createRootContext = () => {
	const scopes = currentWritable(new Set<string>())

	// global state
	const state = currentWritable<Record<string, Record<string, unknown>>>({})

	// global actions, keys are extension scopes
	const actions = currentWritable<Record<string, ExtensionActions>>({})

	// global hotkeys store where the keys are the keycombo ('cmd+a') and the values are the scoped action ids
	const keyMap = currentWritable<Map<string, { scope: string; actionId: string }>>(new Map())

	const runAction = <Actions extends Record<string, (...args: any[]) => Promise<void> | void>>(
		scope: string,
		id: keyof Actions,
		...args: Parameters<Actions[keyof Actions]>
	): ReturnType<Actions[keyof Actions]> => {
		if (!(scope in actions.current)) {
			throw new Error(`Extension with scope "${scope}" does not exist`)
		}
		if (!(id in actions.current[scope])) {
			throw new Error(`Action with id "${id.toString()}" does not exist in scope "${scope}"`)
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		const action = (actions.current[scope] as any)[id] as ExtensionAction

		const select: SelectExtensionState<RecordUnknown> = (selector) => {
			return subStore(state, (s) => {
				return selector(s[scope] as RecordUnknown)
			})
		}

		return action({ select }, ...args) as ReturnType<Actions[keyof Actions]>
	}

	const getExtension = <
		State extends RecordUnknown,
		Actions extends Record<string, (...args: any[]) => Promise<void> | void>,
	>(
		scope: string,
	) => {
		const select = <U>(selector: (s: State) => U): Readable<U> => {
			const store = subStore(state, (s) => {
				return selector(s[scope] as State)
			})
			return {
				subscribe: store.subscribe,
			}
		}

		const run = <K extends keyof Actions>(id: K, ...args: Parameters<Actions[K]>) => {
			runAction(scope, id, ...args)
		}

		return {
			select,
			run,
		}
	}

	const addExtension = <
		State extends Record<string, unknown>,
		Actions extends Record<string, (...args: any[]) => Promise<void> | void>,
	>(options: {
		scope: string
		state: (args: { persist: <T>(value: T) => T }) => State
		actions: {
			[K in keyof Actions]: (
				utils: {
					// setState: SetExtensionState<State>
					// updateState: UpdateExtensionState<State>
					select: SelectExtensionState<State>
					// state: Writable<State>
				},
				...args: Parameters<Actions[K]>
			) => ReturnType<Actions[K]>
		}
		keyMap?: (utils: typeof hotkeyFns) => {
			[Key in keyof Actions]?: Parameters<Actions[Key]> extends [] ? string | string[] : never
		}
		toolbarItems?: SvelteComponent[]
	}) => {
		const makeScopedId = (key: string) => scopeId(options.scope, key)

		const extensionState = options.state({ persist: persist.regular })

		const persistedState = options.state({ persist: persist.dummy })

		const persistedPaths = getPersistedPaths(persistedState)

		if (browser) {
			// load persisted values
			for (const path of persistedPaths) {
				const scopedKey = makeScopedId(path)
				const value = localStorage[scopedKey] as string | undefined
				if (value) {
					const parsedValue = JSON.parse(value) as unknown
					const pathParts = path.split('.')
					const lastPart = pathParts.pop()
					const parent = pathParts.reduce((o, i) => o[i], extensionState)
					parent[lastPart] = parsedValue
				}
			}

			// save persisted values
			window.addEventListener('beforeunload', () => {
				for (const path of persistedPaths) {
					const currentState = get(subStore(state, (s) => s[options.scope])) as State
					const value = path.split('.').reduce((o, i) => o[i], currentState)
					const scopedKey = makeScopedId(path)
					localStorage[scopedKey] = JSON.stringify(value)
				}
			})
		}

		// add extension state to global state
		subStore(state, (s) => s).update((s) => {
			if (options.scope in s) {
				throw new Error(`Extension with scope "${options.scope}" already exists`)
			}
			s[options.scope] = extensionState
			return s
		})

		// add extension actions to global actions
		actions.update((a) => {
			if (options.scope in a) {
				throw new Error(`Extension with scope "${options.scope}" already exists`)
			}
			a[options.scope] = options.actions as unknown as ExtensionActions
			return a
		})

		keyMap.update((keyMap) => {
			if (options.keyMap) {
				// options.keyMap is inverted, the keys are the non-scoped
				// action ids and the values are the key or keycombo
				const inverseKeyMap = options.keyMap(hotkeyFns)
				const castedInverseKeyMap = inverseKeyMap as unknown as Record<string, string | string[]>
				for (const [actionId, keyOrKeyCombo] of Object.entries(castedInverseKeyMap)) {
					const flattenedKeyCombo = flattenKeyCombo(keyOrKeyCombo)
					if (keyMap.has(flattenedKeyCombo)) {
						const action = keyMap.get(flattenedKeyCombo)
						const formattedKeyCombo = formatKeyCombo(flattenedKeyCombo)
						console.warn(
							`"${formattedKeyCombo}" is already used by action "${action?.scope}:${action?.actionId}", skipping …"`,
						)
					} else {
						keyMap.set(flattenedKeyCombo, {
							actionId,
							scope: options.scope,
						})
					}
				}
			}
			return keyMap
		})

		return getExtension<State, Actions>(options.scope)
	}

	const removeExtension = (scope: string) => {
		scopes.update((s) => {
			s.delete(scope)
			return s
		})
		subStore(state, (s) => s).update((s) => {
			delete s[scope]
			return s
		})
		actions.update((a) => {
			delete a[scope]
			return a
		})
		keyMap.update((k) => {
			for (const [keyCombo, { scope: s }] of k.entries()) {
				if (s === scope) {
					k.delete(keyCombo)
				}
			}
			return k
		})
	}

	const context = {
		scopes,
		state,
		actions,
		addExtension,
		removeExtension,
		getExtension,
	}

	setContext('threlte:studio:extensions', context)

	createKeyboardControls(keyMap)

	return context
}

export const useStudio = () => {
	return getContext<ReturnType<typeof createRootContext>>('threlte:studio:extensions')
}
