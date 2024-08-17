'use client'

import { motion } from 'framer-motion'

import { navLinks } from '@/shared/config/links'
import { siteConfig } from '@/shared/config/site'

import { NavLinkComponent, UserButton } from '@/client/components/navigation'
import { Separator } from '@/client/components/ui'
import { useNav } from '@/client/lib/hooks/use-nav'
import { cn } from '@/client/lib/utils'

export const SideNav = ({ className, ...props }: React.ComponentProps<typeof motion.div>) => {
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
				onOpenChange={(open) => {
					setNavOpen(false)
					setCanNavOpen(!open)
				}}
			/>
		</motion.nav>
	)
}
