'use client'

import { motion } from 'framer-motion'
import { type Session } from 'next-auth'

import { links } from '@/shared/config/links'

import {
	NavButton,
	NavIcon,
	NavItemSideIcon,
	NavLabel,
	NavLink,
	NavTitle,
	NavTooltip
} from '@/client/components/navigation/nav-item'
import { UserButton } from '@/client/components/navigation/user-button'
import { Separator } from '@/client/components/ui'
import { useNav } from '@/client/lib/hooks/use-nav'
import { cn } from '@/client/lib/utils'

type NavProps = React.ComponentProps<typeof motion.nav> & {
	session: Session
}

export const SideNav = ({ className, session, ...props }: NavProps) => {
	const { isNavOpen, setNavOpen, canNavOpen } = useNav()

	return (
		<motion.nav
			className={cn('flex h-full w-[60px] flex-shrink-0 flex-col rounded-xl p-2 pb-4', className)}
			animate={{
				width: canNavOpen ? (isNavOpen ? '240px' : '60px') : '240px'
			}}
			{...props}
		>
			<NavTooltip content={links.site?.[0]?.label} isVisible={!isNavOpen}>
				<NavButton className="gap-2 !pl-2">
					{links.site?.[0]?.icon && <NavIcon icon={links.site?.[0]?.icon} className="size-7" />}
					{links.site?.[0]?.label && (
						<NavLabel label={links.site?.[0]?.label} className="text-lg font-semibold tracking-wide" />
					)}
				</NavButton>
			</NavTooltip>

			<Separator className="my-4 mt-2" />

			<NavTitle title="Home" isVisible={isNavOpen || !canNavOpen} />
			{links.home?.map((link) => (
				<NavTooltip key={link.href} content={link.label} isVisible={!isNavOpen}>
					<NavLink href={link.href}>
						<NavIcon icon={link.icon} />
						<NavLabel label={link.label} />
						<NavItemSideIcon isVisible={isNavOpen} />
					</NavLink>
				</NavTooltip>
			))}

			<Separator className="mb-4 mt-2" />

			<NavTitle title="Instructor Resources" isVisible={isNavOpen || !canNavOpen} />
			{links.instructor?.map((link) => (
				<NavTooltip key={link.href} content={link.label} isVisible={!isNavOpen}>
					<NavLink href={link.href}>
						<NavIcon icon={link.icon} />
						<NavLabel label={link.label} />
						<NavItemSideIcon isVisible={isNavOpen} />
					</NavLink>
				</NavTooltip>
			))}

			<NavTooltip content="Toggle Sidebar" isVisible={!isNavOpen}>
				<NavButton className="mt-auto" onClick={() => setNavOpen(!isNavOpen)}>
					<NavIcon icon={isNavOpen ? 'navbarClose' : 'navbarOpen'} />
					<NavLabel label="Toggle Sidebar" disableAnimation />
				</NavButton>
			</NavTooltip>

			<Separator className="mb-4 mt-2" />

			<UserButton session={session} />
		</motion.nav>
	)
}
