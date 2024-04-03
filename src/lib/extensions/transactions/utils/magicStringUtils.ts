import MagicString from 'magic-string'

const isRegExp = (value: unknown): value is RegExp => {
	return value instanceof RegExp
}

/**
 * Replaces all occurrences of a string in a MagicString and retains the source
 * map. Matches against the current string value of the MagicString.
 */
export const replace = (
	magicString: MagicString,
	searchValue: string | RegExp,
	replacer: string,
) => {
	const matches: RegExpMatchArray[] = []
	const populateMatches = () => {
		const str = magicString.toString()
		const currentMatches = str.matchAll(
			isRegExp(searchValue) ? searchValue : new RegExp(searchValue, 'gu'),
		)
		matches.push(...currentMatches)
	}
	const clearMatches = () => {
		matches.length = 0
	}

	populateMatches()
	while (matches.length > 0) {
		const match = matches.pop()
		if (!match) break
		const start = match.index
		if (!start) return
		const end = start + match[0].length
		magicString.overwrite(start, end, replacer)
		clearMatches()
		populateMatches()
	}
}

export const isMagicString = (object: unknown): object is MagicString => {
	return object instanceof MagicString
}
