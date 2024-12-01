import { getPlatformSync } from '@/core/lib/tiptap-editor/platform'

type Platform = 'mac' | 'windows' | 'linux' | 'unknown'

type ShortcutKeyResult = {
	symbol: string
	readable: string
}

const shortcutKeyMap: Record<string, Record<Platform, ShortcutKeyResult>> = {
	mod: {
		mac: { symbol: '⌘', readable: 'Command' },
		windows: { symbol: 'Ctrl', readable: 'Control' },
		linux: { symbol: 'Ctrl', readable: 'Control' },
		unknown: { symbol: 'Ctrl', readable: 'Control' }
	},
	alt: {
		mac: { symbol: '⌥', readable: 'Option' },
		windows: { symbol: 'Alt', readable: 'Alt' },
		linux: { symbol: 'Alt', readable: 'Alt' },
		unknown: { symbol: 'Alt', readable: 'Alt' }
	},
	shift: {
		mac: { symbol: '⇧', readable: 'Shift' },
		windows: { symbol: 'Shift', readable: 'Shift' },
		linux: { symbol: 'Shift', readable: 'Shift' },
		unknown: { symbol: 'Shift', readable: 'Shift' }
	}
}

export const getShortcutKey = (key: string): ShortcutKeyResult => {
	const platform = getPlatformSync()
	const lowercaseKey = key.toLowerCase()

	if (lowercaseKey in shortcutKeyMap) {
		return (
			shortcutKeyMap[lowercaseKey]?.[platform] ?? { symbol: key, readable: key }
		)
	}

	return { symbol: key, readable: key }
}

export const getShortcutKeys = (keys: string[]): ShortcutKeyResult[] => {
	return keys.map(getShortcutKey)
}
