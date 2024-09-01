'use client'

import * as React from 'react'
import { forwardRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { type Link } from '@/shared/types/navigation'

import { NavLinkItem } from '@/client/components/navigation/nav-link'
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

type NavLinksProps = React.HTMLAttributes<HTMLDivElement> & {
	links: Link[]
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
