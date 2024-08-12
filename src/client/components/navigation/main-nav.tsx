'use client'

import { Inter } from 'next/font/google'

import { type NavLink } from '@/shared/types'

import { Icons } from '@/client/components/icons'
import { SideNav, TopNav } from '@/client/components/navigation'
import { NavProvider, useDeviceType } from '@/client/context'
import { cn } from '@/client/lib/utils'

import { Loader } from '../loader'

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

export const MainNav = () => {
	const { deviceSize } = useDeviceType()

	if (!deviceSize)
		return (
			<div className="fixed bottom-0 left-0 right-0 top-0 grid place-items-center bg-background">
				<div className="flex flex-col items-center gap-6">
					<Loader variant="bars" size="large" />
					<h1 className="text-xl font-bold">Please wait</h1>
				</div>
			</div>
		)

	return (
		<NavProvider>
			{deviceSize === 'mobile' ? (
				<TopNav navLinks={navLinks} className={cn('md:hidden', inter.className)} />
			) : (
				<SideNav navLinks={navLinks} className={cn('hidden md:flex md:flex-col', inter.className)} />
			)}
		</NavProvider>
	)
}
