'use client'

import * as React from 'react'

import { usePersistedState } from '@/client/lib/hooks/use-persist-state'

type NavContextType = {
	isNavOpen: boolean
	setNavOpen: (isNavOpen: boolean) => void
}

const NavContext = React.createContext<NavContextType | undefined>(undefined)

export const NavProvider = ({ children }: { children: React.ReactNode }) => {
	const [isNavOpen, setNavOpen] = usePersistedState<boolean>('is-nav-open', false)

	return <NavContext.Provider value={{ isNavOpen, setNavOpen }}>{children}</NavContext.Provider>
}

export const useNav = () => {
	const context = React.useContext(NavContext)
	if (!context) {
		throw new Error('useNav must be used within a NavProvider')
	}
	return context
}
