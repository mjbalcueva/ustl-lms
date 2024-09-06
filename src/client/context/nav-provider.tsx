'use client'

import * as React from 'react'

type NavContextType = {
	isNavOpen: boolean
	setNavOpen: (isNavOpen: boolean) => void
	defaultNavOpen: boolean
	canNavOpen: boolean
	setCanNavOpen: (canNavOpen: boolean) => void
}

const NavContext = React.createContext<NavContextType | undefined>(undefined)

export const NavProvider = ({ children, defaultNavOpen }: { children: React.ReactNode; defaultNavOpen: boolean }) => {
	const [isNavOpen, setNavOpen] = React.useState(defaultNavOpen)
	const [canNavOpen, setCanNavOpen] = React.useState(true)

	React.useEffect(() => {
		document.cookie = `is-nav-open=${isNavOpen};`
	}, [isNavOpen])

	return (
		<NavContext.Provider value={{ isNavOpen, setNavOpen, defaultNavOpen, canNavOpen, setCanNavOpen }}>
			{children}
		</NavContext.Provider>
	)
}

export const useNav = () => {
	const context = React.useContext(NavContext)
	if (!context) {
		throw new Error('useNav must be used within a NavProvider')
	}
	return context
}
