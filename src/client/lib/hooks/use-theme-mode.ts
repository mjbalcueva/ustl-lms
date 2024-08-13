import { useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { useTheme } from 'next-themes'

// Create a Jotai atom for mode, initialized from localStorage if possible
const modeAtom = atom(typeof window !== 'undefined' ? (localStorage.getItem('mode') ?? 'dark') : 'dark')

modeAtom.onMount = (setAtom) => {
	const storedMode = localStorage.getItem('mode')
	if (storedMode) setAtom(storedMode)
}

export const useMode = () => {
	const [mode, setMode] = useAtom(modeAtom)
	const { theme, setTheme } = useTheme()

	const handleModeChange = (newMode: 'light' | 'dark') => {
		const selectedTheme = theme?.split('-')[1]
		const newTheme = `${newMode}-${selectedTheme}`
		setMode(newMode)
		setTheme(newTheme)
	}

	// Update localStorage whenever mode changes
	useEffect(() => {
		localStorage.setItem('mode', mode)
	}, [mode])

	return { mode, handleModeChange }
}
