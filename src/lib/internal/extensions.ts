import { getContext, setContext, SvelteComponent } from 'svelte'
import type { SubImmerStore } from 'svelte-immer-store'
import { createActions } from './actions'
import { createKeyboardControls, hotkeyFns } from './keyboard'
import { createState } from './state'
import { beforeUnload } from './useBeforeUnload'

// type RecordUnknown = Record<symbol, unknown> | Readonly<Record<number, unknown>>

type ExtensionAction = <ExtensionState extends Record<string, unknown>>(
	params: {
		select: SubImmerStore<ExtensionState>['select']
	},
	...args: any[]
) => Promise<void> | void

type ExtensionActions = Record<string, ExtensionAction>

export const createRootContext = () => {
	const state = createState()
	const actions = createActions()
	const keyboardControls = createKeyboardControls((scope, actionId) => {
		actions.runAction(scope, actionId, state.getScopedState(scope), state.record)
	})

	const getExtension = <
		State extends Record<string, unknown>,
		Actions extends Record<string, (...args: any[]) => Promise<void> | void>,
	>(
		scope: string,
	) => {
		const run = <K extends keyof Actions>(id: K, ...args: Parameters<Actions[K]>) => {
			actions.runAction(
				scope,
				id as string,
				state.getScopedState<State>(scope),
				state.record,
				...args,
			)
		}

		return {
			state: state.getScopedReadableState<State>(scope),
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
				params: {
					select: SubImmerStore<State>['select']
					record: (callback: (...args: any[]) => any) => void
				},
				...args: Parameters<Actions[K]>
			) => ReturnType<Actions[K]>
		}
		keyMap?: (utils: typeof hotkeyFns) => {
			[Key in keyof Actions]?: Parameters<Actions[Key]> extends [] ? string | string[] : never
		}
		toolbarItems?: SvelteComponent[]
	}) => {
		state.addExtensionState(options.scope, options.state)
		actions.addExtensionActions(options.scope, options.actions as unknown as ExtensionActions)
		if (options.keyMap) {
			const keyMap = options.keyMap(hotkeyFns)
			keyboardControls.addKeys(options.scope, keyMap)
		}

		return getExtension<State, Actions>(options.scope)
	}

	const removeExtension = (scope: string) => {
		state.persistState(scope)
		state.removeScopedState(scope)
		actions.removeExtensionActions(scope)
		keyboardControls.removeKeys(scope)
	}

	const context = {
		state,
		actions,
		addExtension,
		removeExtension,
		getExtension,
	}

	setContext('threlte:studio:extensions', context)

	// the last thing to do before the window is being closed is to persist the
	// state to the local storage
	beforeUnload(state.persistState, true)

	return context
}

export const useStudio = () => {
	return getContext<ReturnType<typeof createRootContext>>('threlte:studio:extensions')
}
