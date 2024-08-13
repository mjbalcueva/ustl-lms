import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

import { type ThemeType } from '@/shared/types'

import { themes } from '@/client/lib/themes'

export const useUserTheme = () => {
	const [mode, setMode] = useState(() => {
		if (typeof window === 'undefined') return ''
		return localStorage.getItem('mode') ?? 'dark'
	})

	const [isThemeLoading, setIsThemeLoading] = useState(true)
	const { theme, setTheme } = useTheme()

	useEffect(() => {
		const storedMode = localStorage.getItem('mode')
		if (storedMode) setMode(storedMode)
	}, [])

	useEffect(() => {
		localStorage.setItem('mode', mode)
	}, [mode])

	useEffect(() => {
		if (theme) setIsThemeLoading(false)
	}, [theme])

	const handleModeChange = (newMode: 'light' | 'dark') => {
		const selectedTheme = theme?.split('-')[1]
		const newTheme = `${newMode}-${selectedTheme}`
		setMode(newMode)
		setTheme(newTheme)
	}

	const currentThemes = themes[mode as keyof ThemeType]

	return { theme, setTheme, isThemeLoading, mode, handleModeChange, currentThemes }
}
