import type { ParserType } from './vite-plugin/utils/parsers'

export type ServerFunctions = {
	syncTransaction: (transaction: {
		attributeName: string
		attributeValue: unknown
		componentIndex: number
		moduleId: string
		parserType: ParserType
		signature: string
	}) => void
}

export type ClientFunctions = {}
