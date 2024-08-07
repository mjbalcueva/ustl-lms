'use client'

import { Inter } from 'next/font/google'

import { type NavLink } from '@/shared/types'

import { Icons } from '@/client/components/icons'
import { SideNavigation, TopNavigation } from '@/client/components/navigation'
import { ThreeDotsLoader } from '@/client/components/three-dots-loader'
import { NavProvider, useDeviceType } from '@/client/context'
import { cn } from '@/client/lib/utils'

const inter = Inter({
	subsets: ['latin'],
	display: 'swap'
})

const navLinks: NavLink[] = [
	{
		label: 'Dashboard',
		href: '#',
		icon: <Icons.dashboard className="h-5 w-5 flex-shrink-0 text-foreground" />
	},
	{
		label: 'Learning',
		href: '#',
		icon: <Icons.learning className="h-5 w-5 flex-shrink-0 text-foreground" />
	},
	{
		label: 'Reports',
		href: '#',
		icon: <Icons.reports className="h-5 w-5 flex-shrink-0 text-foreground" />
	},
	{
		label: 'Chat',
		href: '#',
		icon: <Icons.messages className="h-5 w-5 flex-shrink-0 text-foreground" />
	}
]

export const MainNavigation = () => {
	const { deviceSize } = useDeviceType()

	if (!deviceSize) return <ThreeDotsLoader />

	return (
		<NavProvider>
			{deviceSize === 'mobile' ? (
				<TopNavigation navLinks={navLinks} className={cn('md:hidden', inter.className)} />
			) : (
				<SideNavigation navLinks={navLinks} className={cn('hidden md:flex md:flex-col', inter.className)} />
			)}
		</NavProvider>
	)
}
