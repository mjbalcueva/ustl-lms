'use client'

import Link, { type LinkProps } from 'next/link'
import * as React from 'react'
import { forwardRef, type Ref } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

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

export const NavContainer = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ ...props }, ref) => {
	return <div ref={ref} className="flex flex-col gap-1 rounded-lg" {...props} />
})
NavContainer.displayName = 'NavContainer'

type NavItemProps = (React.ButtonHTMLAttributes<HTMLButtonElement> | LinkProps) & {
	icon: keyof typeof Icons
	label: string
	className?: string
	isLogo?: boolean
	disableAnimation?: boolean
}
export const NavItem = forwardRef<HTMLButtonElement | HTMLAnchorElement, NavItemProps>(
	({ icon, label, disableAnimation, isLogo, className, ...props }, ref) => {
		const { isNavOpen, canNavOpen } = useNav()
		const Icon = Icons[icon]

		const Component = 'href' in props ? Link : 'button'
		return (
			<Component
				ref={ref as Ref<HTMLAnchorElement & HTMLButtonElement>}
				className={cn(
					'group/navigation flex items-center justify-start py-2 outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring',
					isLogo
						? 'min-h-11 gap-2 rounded-md pl-2'
						: 'gap-3 rounded-md px-5 hover:bg-accent/40 sm:px-7 md:px-3 md:hover:bg-accent',
					className
				)}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				{...(props as any)}
			>
				<Icon className={cn('flex-shrink-0', isLogo ? 'h-7 w-7' : 'h-5 w-5')} />
				{label && (
					<motion.span
						animate={{
							display: canNavOpen ? (isNavOpen ? 'inline-block' : 'none') : 'inline-block',
							opacity: canNavOpen ? (isNavOpen ? 1 : 0) : 1
						}}
						className={cn(
							'hidden whitespace-pre transition duration-150',
							isLogo ? 'text-lg font-semibold tracking-wide' : 'text-sm',
							!disableAnimation && 'group-hover/navigation:translate-x-1.5'
						)}
					>
						{label}
					</motion.span>
				)}
			</Component>
		)
	}
)
NavItem.displayName = 'NavItem'
