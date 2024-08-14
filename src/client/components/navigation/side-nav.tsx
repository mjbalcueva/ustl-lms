'use client'

import { motion } from 'framer-motion'

import { siteConfig } from '@/shared/config/site'
import { type NavLink } from '@/shared/types'

import { Icons } from '@/client/components/icons'
import { NavLinkComponent, UserButton } from '@/client/components/navigation'
import { Separator } from '@/client/components/ui'
import { useNav } from '@/client/lib/hooks/use-nav'
import { cn } from '@/client/lib/utils'

type SideNavProps = {
	navLinks: NavLink[]
} & React.ComponentProps<typeof motion.div>

export const SideNav = ({ navLinks, className, ...props }: SideNavProps) => {
	const { isNavOpen, setNavOpen, canNavOpen, setCanNavOpen } = useNav()

	return (
		<motion.nav
			className={cn('h-full w-[60px] flex-shrink-0 bg-popover py-4', className)}
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
					icon: <Icons.logo2 />
				}}
				isLogo
			/>

			<div className="mx-3 my-2">
				<Separator className="bg-muted" />
			</div>

			<div className="mx-2 flex flex-1 flex-col gap-2.5">
				{navLinks.map((link, index) => (
					<NavLinkComponent key={index} link={link} />
				))}
			</div>

			<div className="mx-3 my-2">
				<Separator className="bg-muted" />
			</div>

			<UserButton
				onOpenChange={(open) => {
					setNavOpen(false)
					setCanNavOpen(!open)
				}}
			/>
		</motion.nav>
	)
}
