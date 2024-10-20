'use client'

import { usePathname } from 'next/navigation'
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
import { Separator } from '@/client/components/ui/separator'
import { useNav } from '@/client/context/nav-provider'
import { useLockScroll } from '@/client/lib/hooks/use-lock-scroll'
import { cn } from '@/client/lib/utils'

type SideNavProps = React.ComponentProps<typeof motion.nav> & {
	links: Link[]
}

export const SideNav = ({ links, className, ...props }: SideNavProps) => {
	const { isNavOpen, setNavOpen } = useNav()
	const { setLockScroll } = useLockScroll()
	const currentPath = usePathname()

	const isActiveLink = (linkHref: string) => {
		if (linkHref === currentPath) return true

		const linkSegments = linkHref.split('/')
		const currentSegments = currentPath.split('/')

		return (
			linkSegments[1] === currentSegments[1] && linkSegments.includes('manage') === currentSegments.includes('manage')
		)
	}

	return (
		<motion.nav
			className={cn(
				'flex h-full flex-shrink-0 flex-col overflow-y-auto overflow-x-hidden rounded-xl px-2 pb-4 pt-0.5',
				isNavOpen ? 'w-[240px]' : 'w-[60px]',
				className
			)}
			animate={{ width: isNavOpen ? '240px' : '60px' }}
			{...props}
		>
			<NavButton className="gap-2 !px-[0.22rem] py-1 hover:cursor-default hover:border-background hover:!bg-transparent hover:!shadow-none dark:hover:!border-card">
				<NavIcon
					icon={site.icon}
					className="size-9 rounded-lg border !border-border bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent to-card p-1.5 text-foreground/80 shadow-sm dark:from-accent dark:to-card"
				/>
				<NavLabel
					label={site.label}
					className="text-lg font-semibold tracking-wide text-card-foreground"
					disableAnimation
				/>
			</NavButton>

			<Separator className="mb-4 mt-1" />

			<NavTitle title="Home" />
			{links[0]?.children?.map((link) => (
				<NavTooltip key={link.href} content={link.label}>
					<NavLink
						href={link.href ?? ''}
						className={cn(
							isActiveLink(link.href ?? '') &&
								'border !border-border bg-card shadow-[0_0_0_-2px_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.05)] dark:bg-accent/70'
						)}
					>
						<NavIcon icon={link.icon} className="text-foreground/80" />
						<NavLabel label={link.label} className={cn(isActiveLink(link.href ?? '') && 'text-card-foreground')} />
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
							<NavLink
								href={link.href ?? ''}
								className={cn(
									isActiveLink(link.href ?? '') &&
										'border !border-border bg-card shadow-[0_0_0_-2px_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.05)] dark:bg-accent/70'
								)}
							>
								<NavIcon icon={link.icon} className="text-foreground/80" />
								<NavLabel label={link.label} className={cn(isActiveLink(link.href ?? '') && 'text-card-foreground')} />
								<NavItemSideIcon />
							</NavLink>
						</NavTooltip>
					))}
				</>
			)}

			<NavTooltip content={isNavOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}>
				<NavButton
					className="mt-auto"
					onClick={() => {
						setNavOpen(!isNavOpen)
						setLockScroll(!isNavOpen)
					}}
				>
					<NavIcon icon={isNavOpen ? 'navbarClose' : 'navbarOpen'} className="text-foreground/80" />
					<NavLabel label={isNavOpen ? 'Collapse Sidebar' : 'Expand Sidebar'} disableAnimation />
				</NavButton>
			</NavTooltip>

			<Separator className="mb-4 mt-2" />

			<UserButton />
		</motion.nav>
	)
}
