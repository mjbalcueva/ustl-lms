'use client'

import Link from 'next/link'
import * as React from 'react'
import { forwardRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { type Link as NavLinkType } from '@/shared/types/navigation'

import { Icons } from '@/client/components/icons'
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

type NavItemButton = React.ButtonHTMLAttributes<HTMLButtonElement> & { asLink?: false }
type NavItemLink = React.AnchorHTMLAttributes<HTMLAnchorElement> & { asLink: true; href: NavLinkType['href'] }
type NavItemProps = Omit<NavLinkType, 'href'> & {
	className?: string
	disableAnimation?: boolean
} & (NavItemLink | NavItemButton)

export const NavItem = forwardRef<HTMLButtonElement, NavItemProps>(
	({ icon, label, disableAnimation, className, asLink, ...props }, ref) => {
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

		if (asLink) {
			return (
				<Link className={sharedClassName} {...(props as NavItemLink)}>
					{content}
				</Link>
			)
		}

		return (
			<button ref={ref} className={sharedClassName} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
				{content}
			</button>
		)
	}
)
NavItem.displayName = 'NavItem'

export const NavLinks = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ ...props }, ref) => {
	return <div ref={ref} className="flex flex-col gap-1 rounded-lg" {...props} />
})
NavLinks.displayName = 'NavLinks'
