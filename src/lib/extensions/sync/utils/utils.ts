import MagicString from 'magic-string'

export const toMagicString = (markup: string): MagicString => {
	return new MagicString(markup)
}

export const recreateMagicString = (markup: MagicString): MagicString => {
	return new MagicString(markup.toString())
}
