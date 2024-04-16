export type ServerFunctions = {
	syncTransaction: (transaction: {
		attributeName: string
		attributeValue: unknown
		componentIndex: number
		moduleId: string
		signature: string
		precision?: number
	}) => void
}

export type ClientFunctions = Record<string, never>
