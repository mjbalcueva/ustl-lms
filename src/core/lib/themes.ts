import { type ThemeType } from '@/core/types/themes'

export const themes: ThemeType = {
	light: [
		{ name: 'default', color: 'bg-zinc-950' },
		{ name: 'ayu', color: 'bg-yellow-500' },
		{ name: 'rose', color: 'bg-rose-500' },
		{ name: 'grass', color: 'bg-green-500' }
	],
	dark: [
		{ name: 'default', color: 'bg-zinc-100' },
		{ name: 'ayu', color: 'bg-yellow-400' },
		{ name: 'rose', color: 'bg-rose-500' },
		{ name: 'grass', color: 'bg-green-500' }
	]
}
