'use client'

import { Inter } from 'next/font/google'
import { type Session } from 'next-auth'

import { type NavLink } from '@/shared/types'

import { Icons } from '@/client/components/icons'
import { SideNav, TopNav } from '@/client/components/navigation'
import { useDeviceType } from '@/client/context'
import { cn } from '@/client/lib/utils'

const inter = Inter({
	subsets: ['latin'],
	display: 'swap'
})

const navLinks: NavLink[] = [
	{
		label: 'Dashboard',
		href: '#',
		icon: <Icons.dashboard className="h-5 w-5 flex-shrink-0" />
	},
	{
		label: 'Learning',
		href: '#',
		icon: <Icons.learning className="h-5 w-5 flex-shrink-0" />
	},
	{
		label: 'Reports',
		href: '#',
		icon: <Icons.reports className="h-5 w-5 flex-shrink-0" />
	},
	{
		label: 'Chat',
		href: '#',
		icon: <Icons.messages className="h-5 w-5 flex-shrink-0" />
	}
]

type MainNavProps = {
	session: Session
}

export const MainNav = ({ session }: MainNavProps) => {
	const { deviceSize } = useDeviceType()

	if (!deviceSize)
		return (
			<div className="fixed bottom-0 left-0 right-0 top-0 grid place-items-center bg-background">
				<div className="flex flex-col items-center gap-6">
					<h1 className="text-lg font-semibold">
						{'Loading'.split('').map((char, index) => (
							<span key={index} className="inline-block animate-bounce" style={{ animationDelay: `${index * 0.08}s` }}>
								{char}
							</span>
						))}
					</h1>
				</div>
			</div>
		)

	return (
		<>
			{deviceSize === 'mobile' ? (
				<TopNav
					session={session}
					navLinks={navLinks}
					className={cn('bg-popover/50 text-popover-foreground md:hidden', inter.className)}
				/>
			) : (
				<SideNav
					session={session}
					navLinks={navLinks}
					className={cn('hidden bg-popover text-popover-foreground md:flex md:flex-col', inter.className)}
				/>
			)}
		</>
	)
}
