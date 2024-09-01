'use client'

import { motion } from 'framer-motion'
import { type Session } from 'next-auth'

import { links } from '@/shared/config/links'

import { NavLinkItem } from '@/client/components/navigation/nav-link'
import { UserButton } from '@/client/components/navigation/user-button'
import { Separator } from '@/client/components/ui'
import { useNav } from '@/client/lib/hooks/use-nav'
import { cn } from '@/client/lib/utils'

import { NavLinks, NavTitle, NavWrapper } from './nav-wrapper'

type NavProps = React.ComponentProps<typeof motion.div> & {
	session: Session
}

export const SideNav = ({ className, session, ...props }: NavProps) => {
	const { isNavOpen, setNavOpen, canNavOpen, setCanNavOpen } = useNav()

	return (
		<motion.nav
			className={cn('flex h-full w-[60px] flex-shrink-0 flex-col gap-4 rounded-xl p-2 pb-4', className)}
			animate={{
				width: canNavOpen ? (isNavOpen ? '240px' : '60px') : '240px'
			}}
			{...props}
		>
			{links.site?.[0] && <NavLinkItem link={links.site?.[0]} isLogo />}
			<Separator />

			<NavWrapper>
				<NavTitle title="Home" isVisible={isNavOpen || !canNavOpen} />
				<NavLinks links={links.home ?? []} />
			</NavWrapper>

			<Separator />

			<NavWrapper>
				<NavTitle title="Instructor Resources" isVisible={isNavOpen || !canNavOpen} />
				<NavLinks links={links.instructor ?? []} />
			</NavWrapper>

			<Separator className="mt-auto" />

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
