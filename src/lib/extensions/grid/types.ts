export const gridScope = 'grid'

export type GridState = {
	enabled: boolean
}

export type GridActions = {
	toggleEnabled: () => void
	setEnabled: (enabled: boolean) => void
}
