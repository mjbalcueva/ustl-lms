'use client'

import { motion } from 'framer-motion'
import { type Session } from 'next-auth'

import { links } from '@/shared/config/links'

import { NavLinkItem } from '@/client/components/navigation/nav-link'
import { UserButton } from '@/client/components/navigation/user-button'
import { Separator } from '@/client/components/ui'
import { useNav } from '@/client/lib/hooks/use-nav'
import { cn } from '@/client/lib/utils'

import { NavSection, NavSectionTitle } from './nav-section'

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
			onMouseEnter={() => setNavOpen(true)}
			onMouseLeave={() => setNavOpen(false)}
			{...props}
		>
			{links.site?.[0] && <NavLinkItem link={links.site?.[0]} isLogo />}
			<Separator />

			<div className="rounded-lg">
				<NavSectionTitle title="Home" isVisible={isNavOpen || !canNavOpen} />
				<NavSection>{links.home?.map((link, index) => <NavLinkItem key={index} link={link} />)}</NavSection>
			</div>

			<Separator />

			<div className="rounded-lg">
				<NavSectionTitle title="Instructor Resources" isVisible={isNavOpen || !canNavOpen} />
				<NavSection>{links.instructor?.map((link, index) => <NavLinkItem key={index} link={link} />)}</NavSection>
			</div>

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
