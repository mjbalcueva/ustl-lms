'use client'

import { atom, useAtom } from 'jotai'

const isNavOpenAtom = atom(false)
const canNavOpenAtom = atom(true)

export const useNav = () => {
	const [isNavOpen, setNavOpen] = useAtom(isNavOpenAtom)
	const [canNavOpen, setCanNavOpen] = useAtom(canNavOpenAtom)

	return { isNavOpen, setNavOpen, canNavOpen, setCanNavOpen }
}
