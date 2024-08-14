'use client'

import { createContext, useContext, useState } from 'react'

type NavContextProps = {
	isNavOpen: boolean
	setNavOpen: (open: boolean) => void
	canNavOpen: boolean
	setCanNavOpen: (canOpen: boolean) => void
}

const NavContext = createContext<NavContextProps | undefined>(undefined)

const NavProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
	const [isNavOpen, setNavOpen] = useState(false)
	const [canNavOpen, setCanNavOpen] = useState(true)

	return (
		<NavContext.Provider value={{ isNavOpen, setNavOpen, canNavOpen, setCanNavOpen }}>{children}</NavContext.Provider>
	)
}

const useNavContext = () => {
	const context = useContext(NavContext)
	if (!context) throw new Error('useNavContext must be used within a NavProvider')

	return context
}

export { NavProvider, useNavContext }
