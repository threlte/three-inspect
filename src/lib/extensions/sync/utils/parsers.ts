type Parser = {
	stringify: (value: unknown) => string
	parse: (value: string) => unknown
}

export const defaultParser: Parser = {
	parse(value) {
		return JSON.parse(value) as unknown
	},
	stringify(value) {
		return JSON.stringify(value)
	},
}
