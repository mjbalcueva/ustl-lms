'use client'

import { motion } from 'framer-motion'
import { type Session } from 'next-auth'

import { navLinks } from '@/shared/config/links'
import { siteConfig } from '@/shared/config/site'

import { NavLinkComponent } from '@/client/components/navigation/nav-link'
import { UserButton } from '@/client/components/navigation/user-button'
import { Separator } from '@/client/components/ui'
import { useNav } from '@/client/lib/hooks/use-nav'
import { cn } from '@/client/lib/utils'

type NavProps = React.ComponentProps<typeof motion.div> & {
	session: Session
}

export const SideNav = ({ className, session, ...props }: NavProps) => {
	const { isNavOpen, setNavOpen, canNavOpen, setCanNavOpen } = useNav()

	return (
		<motion.nav
			className={cn('flex h-full w-[60px] flex-shrink-0 flex-col gap-3 rounded-xl p-2 pb-4', className)}
			animate={{
				width: canNavOpen ? (isNavOpen ? '240px' : '60px') : '240px'
			}}
			onMouseEnter={() => setNavOpen(true)}
			onMouseLeave={() => setNavOpen(false)}
			{...props}
		>
			<NavLinkComponent
				link={{
					label: siteConfig.title,
					href: '/dashboard',
					icon: 'logo'
				}}
				isLogo
			/>

			<Separator className="bg-muted" />

			<div className="flex flex-1 flex-col gap-2.5 rounded-lg">
				{navLinks.map((link, index) => (
					<NavLinkComponent key={index} link={link} />
				))}
			</div>

			<Separator className="bg-muted" />

			<UserButton
				session={session}
				onOpenChange={(open) => {
					setNavOpen(false)
					setCanNavOpen(!open)
				}}
			/>
		</motion.nav>
	)
}
