'use client'

import * as React from 'react'

export function usePersistedState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
	const [state, setState] = React.useState<T>(defaultValue)
	const [isInitialized, setIsInitialized] = React.useState(false)

	React.useEffect(() => {
		if (typeof window !== 'undefined') {
			try {
				const storedValue = localStorage.getItem(key)
				if (storedValue) setState(JSON.parse(storedValue) as T)
			} catch (error) {
				console.error('Error reading from localStorage:', error)
			}
			setIsInitialized(true)
		}
	}, [key])

	React.useEffect(() => {
		if (isInitialized && typeof window !== 'undefined') {
			try {
				localStorage.setItem(key, JSON.stringify(state))
			} catch (error) {
				console.error('Error writing to localStorage:', error)
			}
		}
	}, [key, state, isInitialized])

	return [state, setState]
}
