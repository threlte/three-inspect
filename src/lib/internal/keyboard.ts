import type { CurrentWritable } from '@threlte/core'
import { onMount } from 'svelte'
import { useStudio } from './extensions'

const metaKeys = new Set(['ctrl', 'alt', 'shift', 'meta'])

const makeHotkeyFn = (hotkey: string): ((key: string | string[]) => string[]) => {
	return (key: string | string[]) => {
		const keys = Array.isArray(key) ? key : [key]
		keys.push(hotkey)
		return keys
	}
}

export const hotkeyFns = {
	ctrl: makeHotkeyFn('ctrl'),
	alt: makeHotkeyFn('alt'),
	shift: makeHotkeyFn('shift'),
	meta: makeHotkeyFn('meta'),
}

const keyDelimiter = '§§§'

export const formatKeyCombo = (keyCombo: string) => {
	const [metaKeys, otherKeys] = keyCombo.split(keyDelimiter)
	return [...metaKeys, ...otherKeys].join('+')
}

/**
 * Creates a string representation from an array of keyboard keys with a
 * delimiter that is unlikely to be used in a keyboard shortcut. Flattened
 * representations can be used to easily compare keyboard presses against a
 * map of shortcuts.
 *
 * @example
 * ```ts
 * const keys = ['cmd', 'shift', 'a']
 * const flattenedKeyCombo = flattenKeyCombo(keys)
 * console.log(flattenedKeyCombo) // 'cmd§§§shift§§§a'
 * ```
 */
export const flattenKeyCombo = (keyCombo: string[] | string) => {
	if (!Array.isArray(keyCombo)) return keyCombo
	const metaKeysArray = keyCombo.filter((k) => metaKeys.has(k)).toSorted()
	const otherKeysArray = keyCombo.filter((k) => !metaKeys.has(k)).toSorted()
	return [...metaKeysArray, ...otherKeysArray].join(keyDelimiter)
}

export const createKeyboardControls = (
	keyMap: CurrentWritable<Map<string, { scope: string; actionId: string }>>,
) => {
	const { getExtension } = useStudio()

	const onKeyDown = (e: KeyboardEvent) => {
		const MetaKeys = ['Meta', 'Control', 'Alt', 'Shift']
		if (MetaKeys.includes(e.key)) return

		const keys = []
		const meta = e.metaKey
		if (meta) keys.push('meta')
		const ctrl = e.ctrlKey
		if (ctrl) keys.push('ctrl')
		const alt = e.altKey
		if (alt) keys.push('alt')
		const shift = e.shiftKey
		if (shift) keys.push('shift')

		keys.push(e.key)
		const flattenedKeyCombo = flattenKeyCombo(keys)
		if (keyMap.current.has(flattenedKeyCombo)) {
			e.preventDefault()
			const action = keyMap.current.get(flattenedKeyCombo)
			if (!action) return
			// no need to await here
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			getExtension(action.scope).run(action.actionId)
		}
	}

	onMount(() => {
		window.addEventListener('keydown', onKeyDown)
		return () => {
			window.removeEventListener('keydown', onKeyDown)
		}
	})
}
