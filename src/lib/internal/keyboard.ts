import { currentWritable } from '@threlte/core'
import { onMount } from 'svelte'

const metaKeys = new Set(['ctrl', 'alt', 'shift', 'meta'])

const keyDelimiter = '§§§'

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

export const formatKeyCombo = (keyCombo: string): string => {
	return keyCombo.split(keyDelimiter).join('+')
}

export const createKeyboardControls = (runAction: (scope: string, actionId: string) => void) => {
	const enabled = currentWritable(true)

	const keyMap = currentWritable<Map<string, { scope: string; actionId: string }>>(new Map())

	const addKeys = (scope: string, keyMapItems: Record<string, string | string[] | undefined>) => {
		keyMap.update((keyMap) => {
			for (const [actionId, keyOrKeyCombo] of Object.entries(keyMapItems)) {
				if (!keyOrKeyCombo) continue
				const flattenedKeyCombo = flattenKeyCombo(keyOrKeyCombo)
				if (keyMap.has(flattenedKeyCombo)) {
					const action = keyMap.get(flattenedKeyCombo)
					const formattedKeyCombo = formatKeyCombo(flattenedKeyCombo)
					console.warn(
						`"${formattedKeyCombo}" is already used by action "${action?.scope}:${action?.actionId}", skipping …"`,
					)
				} else {
					keyMap.set(flattenedKeyCombo, {
						scope,
						actionId,
					})
				}
			}
			return keyMap
		})
	}

	const removeKeys = (scope: string) => {
		keyMap.update((k) => {
			for (const [keys, { scope: s }] of k.entries()) {
				if (s === scope) {
					k.delete(keys)
				}
			}
			return k
		})
	}

	const onKeyDown = (e: KeyboardEvent) => {
		if (!enabled.current) return

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

		keys.push(e.key.toLowerCase())
		const flattenedKeyCombo = flattenKeyCombo(keys)
		if (keyMap.current.has(flattenedKeyCombo)) {
			e.preventDefault()
			const action = keyMap.current.get(flattenedKeyCombo)
			if (!action) return
			// no need to await here
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			runAction(action.scope, action.actionId)
		}
	}

	onMount(() => {
		window.addEventListener('keydown', onKeyDown)
		return () => {
			window.removeEventListener('keydown', onKeyDown)
		}
	})

	return {
		removeKeys,
		addKeys,
		enabled,
	}
}
