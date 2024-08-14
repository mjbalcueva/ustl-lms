'use client'

import Link, { type LinkProps } from 'next/link'
import { motion } from 'framer-motion'

import { type NavLink } from '@/shared/types'

import { useNav } from '@/client/lib/hooks/use-nav'
import { cn } from '@/client/lib/utils'

export const NavLinkComponent = ({
	link,
	isLogo,
	className,
	...props
}: {
	link: NavLink
	isLogo?: boolean
	className?: string
	props?: LinkProps
}) => {
	const { isNavOpen, canNavOpen } = useNav()

	return (
		<Link
			href={link.href}
			className={cn(
				'group/navigation flex items-center justify-start gap-3 py-2 outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring',
				isLogo
					? 'mx-2 rounded-md pl-2'
					: 'rounded-md px-5 text-popover-foreground hover:bg-accent/40 sm:px-7 md:px-3 md:hover:bg-accent',
				className
			)}
			{...props}
		>
			{link.icon}

			<motion.span
				animate={{
					display: canNavOpen ? (isNavOpen ? 'inline-block' : 'none') : 'inline-block',
					opacity: canNavOpen ? (isNavOpen ? 1 : 0) : 1
				}}
				className={cn(
					'hidden whitespace-pre transition duration-150',
					isLogo ? 'text-lg font-semibold tracking-wide' : 'text-sm group-hover/navigation:translate-x-1.5'
				)}
			>
				{link.label}
			</motion.span>
		</Link>
	)
}
