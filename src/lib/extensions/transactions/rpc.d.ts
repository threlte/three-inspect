export type ServerFunctions = {
	syncTransaction: (transaction: {
		attributeName: string
		attributeValue: unknown
		componentIndex: number
		moduleId: string
		signature: string
	}) => void
}

export type ClientFunctions = {}
