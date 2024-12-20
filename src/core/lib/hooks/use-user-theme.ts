import { useTheme } from 'next-themes'
import { useLocalStorage } from 'usehooks-ts'

import { themes } from '@/core/lib/themes'
import { type ThemeType } from '@/core/types/themes'

export const useUserTheme = () => {
	const { theme, setTheme } = useTheme()
	const directMode = theme?.split('-')[0]
	const directTheme = theme?.split('-')[1]
	const [mode, setMode] = useLocalStorage('mode', directMode)

	const handleModeChange = (newMode: 'light' | 'dark') => {
		setMode(newMode)
		setTheme(`${newMode}-${directTheme}`)
	}

	const handleThemeChange = (newMode: typeof mode, newTheme: string) => {
		setTheme(`${newMode}-${newTheme}`)
	}

	const themeOptions = themes[mode as keyof ThemeType]

	return { theme, handleThemeChange, mode, handleModeChange, themeOptions }
}
