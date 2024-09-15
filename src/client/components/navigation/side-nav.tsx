'use client'

import { motion } from 'framer-motion'

import { site } from '@/shared/config/links'
import { type Link } from '@/shared/types/navigation'

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

type SideNavProps = React.ComponentProps<typeof motion.nav> & {
	links: Link[]
}

export const SideNav = ({ links, className, ...props }: SideNavProps) => {
	const { isNavOpen, setNavOpen } = useNav()

	return (
		<motion.nav
			className={cn(
				'flex h-full flex-shrink-0 flex-col overflow-y-auto overflow-x-hidden rounded-xl p-2',
				isNavOpen ? 'w-[240px]' : 'w-[60px]',
				className
			)}
			animate={{
				width: isNavOpen ? '240px' : '60px'
			}}
			{...props}
		>
			<NavButton className="gap-2 !px-1 py-1 hover:cursor-default hover:bg-transparent">
				<NavIcon
					icon={site.icon}
					className="size-9 rounded-lg bg-gradient-to-b from-accent to-background p-1.5 text-foreground"
				/>
				<NavLabel label={site.label} className="text-lg font-semibold tracking-wide" disableAnimation />
			</NavButton>

			<Separator className="mb-4 mt-2" />

			<NavTitle title="Home" />
			{links[0]?.children?.map((link) => (
				<NavTooltip key={link.href} content={link.label}>
					<NavLink href={link.href ?? ''}>
						<NavIcon icon={link.icon} />
						<NavLabel label={link.label} />
						<NavItemSideIcon />
					</NavLink>
				</NavTooltip>
			))}

			{!!links[1]?.children?.length && (
				<>
					<Separator className="mb-4 mt-2" />

					<NavTitle title="Instructor Resources" />
					{links[1]?.children?.map((link) => (
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
