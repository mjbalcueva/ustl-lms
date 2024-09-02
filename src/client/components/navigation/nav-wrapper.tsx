'use client'

import Link from 'next/link'
import * as React from 'react'
import { forwardRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { type Link as NavLink } from '@/shared/types/navigation'

import { Icons } from '@/client/components/icons'
import { NavLinkItem } from '@/client/components/navigation/nav-link'
import { useNav } from '@/client/lib/hooks/use-nav'
import { cn } from '@/client/lib/utils'

export const NavWrapper = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, children, ...props }, ref) => {
		return (
			<div ref={ref} className={cn('rounded-lg', className)} {...props}>
				{children}
			</div>
		)
	}
)
NavWrapper.displayName = 'NavSection'

type NavTitleProps = React.ComponentProps<typeof motion.div> & {
	title: string
	isVisible: boolean
}
export const NavTitle = forwardRef<HTMLDivElement, NavTitleProps>(({ title, isVisible, ...props }, ref) => {
	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					ref={ref}
					className="flex flex-col overflow-hidden rounded-lg"
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: '2rem' }}
					exit={{ opacity: 0, height: 0 }}
					{...props}
				>
					<span className="select-none px-3 py-2 text-xs font-medium text-muted-foreground">{title}</span>
				</motion.div>
			)}
		</AnimatePresence>
	)
})
NavTitle.displayName = 'NavTitle'

type NavItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	icon: keyof typeof Icons
	label?: string
	disableAnimation?: boolean
	asLink?: boolean
	href?: string
}

export const NavItem = forwardRef<HTMLButtonElement, NavItemProps>(
	({ icon, label, disableAnimation, className, asLink, href, ...props }, ref) => {
		const { isNavOpen, canNavOpen } = useNav()
		const Icon = Icons[icon]

		const content = (
			<>
				<Icon className={cn('flex-shrink-0', 'h-5 w-5')} />
				{label && (
					<motion.span
						animate={{
							display: canNavOpen ? (isNavOpen ? 'inline-block' : 'none') : 'inline-block',
							opacity: canNavOpen ? (isNavOpen ? 1 : 0) : 1
						}}
						className={cn(
							'hidden whitespace-pre text-sm transition duration-150',
							!disableAnimation && 'group-hover/navigation:translate-x-1.5'
						)}
					>
						{label}
					</motion.span>
				)}
			</>
		)

		const sharedClassName = cn(
			'group/navigation flex items-center justify-start gap-3 rounded-md px-5 py-2 outline-none ring-offset-background hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring sm:px-7 md:px-3 md:hover:bg-accent',
			className
		)

		if (asLink && href) {
			return (
				<Link href={href} className={sharedClassName} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
					{content}
				</Link>
			)
		}

		return (
			<button ref={ref} className={sharedClassName} {...props}>
				{content}
			</button>
		)
	}
)
NavItem.displayName = 'NavItem'

type NavLinksProps = React.HTMLAttributes<HTMLDivElement> & {
	links: NavLink[]
}
export const NavLinks = forwardRef<HTMLDivElement, NavLinksProps>(({ links, ...props }, ref) => {
	return (
		<div ref={ref} className="flex flex-col gap-1 rounded-lg" {...props}>
			{links.map((link) => (
				<NavLinkItem key={link.href} link={link} />
			))}
		</div>
	)
})
NavLinks.displayName = 'NavLinks'
