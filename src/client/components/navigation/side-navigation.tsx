'use client'

import { motion } from 'framer-motion'

import { siteConfig } from '@/shared/config/site'
import { type NavLink } from '@/shared/types'

import { Icons } from '@/client/components/icons'
import { NavLinkComponent, UserButton } from '@/client/components/navigation'
import { Separator } from '@/client/components/ui'
import { useNavContext } from '@/client/context'
import { cn } from '@/client/lib/utils'

export const SideNavigation = ({
	navLinks,
	className,
	...props
}: React.ComponentProps<typeof motion.div> & { navLinks: NavLink[] }) => {
	const { isNavExpanded, setNavExpanded, animate } = useNavContext()

	return (
		<motion.nav
			className={cn('h-full w-[60px] flex-shrink-0 bg-popover py-4', className)}
			animate={{
				width: animate ? (isNavExpanded ? '240px' : '60px') : '240px'
			}}
			onMouseEnter={() => setNavExpanded(true)}
			onMouseLeave={() => setNavExpanded(false)}
			{...props}
		>
			<NavLinkComponent
				link={{
					label: siteConfig.title,
					href: '/',
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

			<UserButton />
		</motion.nav>
	)
}
