'use client'

import { Comfortaa } from 'next/font/google'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { type Session } from 'next-auth'

import { useNav } from '@/core/components/context/nav-provider'
import {
	NavButton,
	NavIcon,
	NavItemSideIcon,
	NavLabel,
	NavLink,
	NavTitle,
	NavTooltip
} from '@/core/components/nav-bar/nav-item'
import { UserButton } from '@/core/components/nav-bar/user-button'
import { Separator } from '@/core/components/ui/separator'
import { site } from '@/core/config/links'
import { useLockScroll } from '@/core/lib/hooks/use-lock-scroll'
import { Close, Open } from '@/core/lib/icons'
import { cn } from '@/core/lib/utils/cn'
import { type Link } from '@/core/types/links'

const comfortaa = Comfortaa({
	subsets: ['latin'],
	display: 'swap'
})

type SideNavProps = React.ComponentProps<typeof motion.nav> & {
	links: Link[]
	session: Session | null
}

export const SideNav = ({
	links,
	session,
	className,
	...props
}: SideNavProps) => {
	const { isNavOpen, setNavOpen } = useNav()
	const { setLockScroll } = useLockScroll()
	const currentPath = usePathname()

	const isActiveLink = (linkHref: string) => {
		if (linkHref === currentPath) return true

		const linkSegments = linkHref.split('/')
		const currentSegments = currentPath.split('/')

		return (
			linkSegments[1] === currentSegments[1] &&
			(linkSegments[1] === 'instructor'
				? linkSegments[2] === currentSegments[2]
				: true)
		)
	}

	return (
		<motion.nav
			className={cn(
				'hidden h-full flex-shrink-0 flex-col overflow-y-auto overflow-x-hidden rounded-xl px-2 pb-4 pt-0.5 md:flex',
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
					className={cn(
						'text-xl font-bold tracking-widest text-card-foreground',
						comfortaa.className
					)}
					disableAnimation
				/>
			</NavButton>

			<Separator className="mb-4 mt-1" />

			{links[0] && (
				<>
					<NavTitle title={links[0].label} />
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
								<NavLabel
									label={link.label}
									className={cn(
										isActiveLink(link.href ?? '') && 'text-card-foreground'
									)}
								/>
								<NavItemSideIcon />
							</NavLink>
						</NavTooltip>
					))}
				</>
			)}

			{!!links[1]?.children?.length && (
				<>
					<Separator className="mb-4 mt-2" />
					<NavTitle title={links[1].label} />
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
								<NavLabel
									label={link.label}
									className={cn(
										isActiveLink(link.href ?? '') && 'text-card-foreground'
									)}
								/>
								<NavItemSideIcon />
							</NavLink>
						</NavTooltip>
					))}
				</>
			)}

			{!!links[2]?.children?.length && (
				<>
					<Separator className="mb-4 mt-2" />
					<NavTitle title={links[2].label} />
					{links[2]?.children?.map((link) => (
						<NavTooltip key={link.href} content={link.label}>
							<NavLink
								href={link.href ?? ''}
								className={cn(
									isActiveLink(link.href ?? '') &&
										'border !border-border bg-card shadow-[0_0_0_-2px_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.05)] dark:bg-accent/70'
								)}
							>
								<NavIcon icon={link.icon} className="text-foreground/80" />
								<NavLabel
									label={link.label}
									className={cn(
										isActiveLink(link.href ?? '') && 'text-card-foreground'
									)}
								/>
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
					<NavIcon
						icon={isNavOpen ? Close : Open}
						className="text-foreground/80"
					/>
					<NavLabel
						label={isNavOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
						disableAnimation
					/>
				</NavButton>
			</NavTooltip>

			<Separator className="mb-4 mt-2" />

			<UserButton session={session} />
		</motion.nav>
	)
}
