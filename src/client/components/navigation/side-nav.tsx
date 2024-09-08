'use client'

import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'

import { home, instructor, site } from '@/shared/config/links'

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
import { useNav } from '@/client/context/nav-provider'
import { cn } from '@/client/lib/utils'

export const SideNav = ({ className, ...props }: React.ComponentProps<typeof motion.nav>) => {
	const { isNavOpen, setNavOpen, canNavOpen } = useNav()
	const { data: session } = useSession()
	const userRole = session?.user.role

	return (
		<motion.nav
			className={cn(
				'flex h-full flex-shrink-0 flex-col overflow-y-auto overflow-x-hidden rounded-xl p-2 pb-4',
				isNavOpen ? 'w-[240px]' : 'w-[60px]',
				className
			)}
			animate={{
				width: canNavOpen ? (isNavOpen ? '240px' : '60px') : '240px'
			}}
			{...props}
		>
			<NavButton className="gap-2 !pl-2 hover:cursor-default hover:bg-transparent">
				<NavIcon icon={site.icon} className="size-7" />
				<NavLabel label={site.label} className="text-lg font-semibold tracking-wide" disableAnimation />
			</NavButton>

			<Separator className="mb-4" />

			<NavTitle title="Home" />
			{home[0]?.children?.map((link) => (
				<NavTooltip key={link.href} content={link.label}>
					<NavLink href={link.href ?? ''}>
						<NavIcon icon={link.icon} />
						<NavLabel label={link.label} />
						<NavItemSideIcon />
					</NavLink>
				</NavTooltip>
			))}

			{userRole === 'INSTRUCTOR' && (
				<>
					<Separator className="mb-4 mt-2" />

					<NavTitle title="Instructor Resources" />
					{instructor[0]?.children?.map((link) => (
						<NavTooltip key={link.href} content={link.label}>
							<NavLink href={link.href ?? ''}>
								<NavIcon icon={link.icon} />
								<NavLabel label={link.label} />
								<NavItemSideIcon />
							</NavLink>
						</NavTooltip>
					))}
				</>
			)}

			<NavTooltip content={isNavOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}>
				<NavButton className="mt-auto" onClick={() => setNavOpen(!isNavOpen)}>
					<NavIcon icon={isNavOpen ? 'navbarClose' : 'navbarOpen'} />
					<NavLabel label={isNavOpen ? 'Collapse Sidebar' : 'Expand Sidebar'} disableAnimation />
				</NavButton>
			</NavTooltip>

			<Separator className="mb-4 mt-2" />

			<UserButton />
		</motion.nav>
	)
}
