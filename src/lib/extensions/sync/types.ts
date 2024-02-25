export const syncScope = 'sync'

export type SyncState = {
	enabled: boolean
	mode: 'auto' | 'manual'
}

export type SyncActions = {
	setEnabled: (enabled: boolean) => void
}
