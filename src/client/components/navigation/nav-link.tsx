'use client'

import Link, { type LinkProps } from 'next/link'
import { forwardRef } from 'react'
import { motion } from 'framer-motion'

import { type Link as NavLink } from '@/shared/types/navigation'

import { Icons } from '@/client/components/icons'
import { useNav } from '@/client/lib/hooks/use-nav'
import { cn } from '@/client/lib/utils'

type NavLinkComponentProps = {
	link: NavLink
	isLogo?: boolean
	className?: string
} & Omit<LinkProps, 'href'>

export const NavLinkComponent = forwardRef<HTMLAnchorElement, NavLinkComponentProps>(
	({ link, isLogo, className, ...props }, ref) => {
		const { isNavOpen, canNavOpen } = useNav()
		const Icon = Icons[link.icon]

		return (
			<Link
				ref={ref}
				href={link.href}
				className={cn(
					'group/navigation flex items-center justify-start py-2 outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring',
					isLogo
						? 'min-h-11 gap-2 rounded-md pl-2'
						: 'gap-3 rounded-md px-5 hover:bg-accent/40 sm:px-7 md:px-3 md:hover:bg-accent',
					className
				)}
				{...props}
			>
				<Icon className={cn('flex-shrink-0', isLogo ? 'h-7 w-7' : 'h-5 w-5')} />

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
)
NavLinkComponent.displayName = 'NavLinkComponent'
