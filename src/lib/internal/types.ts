import type { SubImmerStore } from 'svelte-immer-store'

export type ExtensionState = Record<string, unknown>

export type ExtensionAction<State extends ExtensionState> = (
	params: {
		select: SubImmerStore<State>['select']
		record: (callback: (...args: any[]) => any) => void
	},
	...args: any[]
) => Promise<void> | void

export type ExtensionActions<State extends ExtensionState> = Record<string, ExtensionAction<State>>
