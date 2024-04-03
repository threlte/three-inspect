import type { Vector3Tuple } from 'three'

/**
 * A Parser has three responsibilities:
 * - parse a string into a value
 * - stringify a value into a string
 * - (optionally) determine if a value is the default value
 */
export type Parser<T = unknown> = {
	stringify: (value: T) => string
	parse: (value: string) => T
	isDefaultValue?: (value: T) => boolean
}

const defaultParser: Parser = {
	parse(value) {
		return JSON.parse(value) as unknown
	},
	stringify(value) {
		return JSON.stringify(value)
	},
}

const stringParser: Parser = {
	stringify(value) {
		return value as string
	},
	parse(value) {
		return value
	},
}

const positionParser: Parser<Vector3Tuple> = {
	stringify(value) {
		return `[${value[0]}, ${value[1]}, ${value[2]}]`
	},
	parse(value) {
		return JSON.parse(value) as Vector3Tuple
	},
	isDefaultValue(value) {
		return value[0] === 0 && value[1] === 0 && value[2] === 0
	},
}

export const parsers = {
	json: defaultParser,
	string: stringParser,
	position: positionParser,
} satisfies Record<string, Parser<any>>

export type ParserType = keyof typeof parsers
