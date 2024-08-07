'use client'

import * as React from 'react'

type NavContextProps = {
	isNavExpanded: boolean
	setNavExpanded: React.Dispatch<React.SetStateAction<boolean>>
	animate: boolean
	setAnimate: React.Dispatch<React.SetStateAction<boolean>>
}

const NavContext = React.createContext<NavContextProps | undefined>(undefined)

const NavProvider = ({
	children,
	open: openProp,
	setOpen: setOpenProp,
	animate,
	setAnimate: setAnimateProp
}: {
	children: React.ReactNode
	open?: boolean
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>
	animate?: boolean
	setAnimate?: React.Dispatch<React.SetStateAction<boolean>>
}) => {
	const [openState, setOpenState] = React.useState(false)
	const [animateState, setAnimateState] = React.useState(animate ?? true)

	const isNavExpanded = openProp ?? openState
	const setNavExpanded = setOpenProp ?? setOpenState
	const setAnimate = setAnimateProp ?? setAnimateState

	return (
		<NavContext.Provider value={{ isNavExpanded, setNavExpanded, animate: animateState, setAnimate: setAnimate }}>
			{children}
		</NavContext.Provider>
	)
}

const useNavContext = () => {
	const context = React.useContext(NavContext)
	if (!context) {
		throw new Error('useNavContext must be used within a NavProvider')
	}
	return context
}

export { NavProvider, useNavContext }
