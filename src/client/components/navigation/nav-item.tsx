'use client'

import Link from 'next/link'
import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { type IconBaseProps } from 'react-icons/lib'
import { TbArrowRight } from 'react-icons/tb'

import { Icons } from '@/client/components/icons'
import { useNav } from '@/client/context/nav-provider'
import { cn } from '@/client/lib/utils'

import { Tooltip, TooltipContent, TooltipTrigger } from '../ui'

type NavLinkProps = React.HTMLAttributes<HTMLAnchorElement> & {
	href: string
	className?: string
	children: React.ReactNode
}
export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(({ className, children, ...props }, ref) => {
	return (
		<Link
			ref={ref}
			className={cn(
				'group/navigation mb-2 flex items-center justify-start gap-3 rounded-md px-5 py-2 outline-none ring-offset-background hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring sm:px-7 md:px-3 md:hover:bg-accent',
				className
			)}
			{...props}
		>
			{children}
		</Link>
	)
})
NavLink.displayName = 'NavLink'

type NavButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>
export const NavButton = React.forwardRef<HTMLButtonElement, NavButtonProps>(({ className, ...props }, ref) => {
	return (
		<button
			ref={ref}
			className={cn(
				'group/navigation mb-2 flex items-center justify-start gap-3 rounded-md px-5 py-2 outline-none ring-offset-background hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring sm:px-7 md:px-3',
				className
			)}
			{...props}
		/>
	)
})
NavButton.displayName = 'NavButton'

type NavTooltipProps = React.ComponentProps<typeof Tooltip> & {
	isVisible: boolean
	content: React.ReactNode
}
export const NavTooltip = ({ isVisible, children, content, ...props }: NavTooltipProps) => {
	if (!isVisible) return <>{children}</>
	return (
		<Tooltip {...props} delayDuration={300}>
			<TooltipTrigger asChild>{children}</TooltipTrigger>
			<TooltipContent side="right">{content}</TooltipContent>
		</Tooltip>
	)
}

type NavTitleProps = {
	title: string
}
export const NavTitle = ({ title, ...props }: NavTitleProps) => {
	const { isNavOpen } = useNav()
	return (
		<AnimatePresence>
			<motion.div
				className="flex overflow-hidden rounded-lg"
				initial={{ opacity: isNavOpen ? 1 : 0, height: isNavOpen ? '2rem' : 0 }}
				animate={{ opacity: isNavOpen ? 1 : 0, height: isNavOpen ? '2rem' : 0 }}
				exit={{ opacity: isNavOpen ? 0 : 1, height: isNavOpen ? '2rem' : 0 }}
				{...props}
			>
				<span className="select-none px-3 py-2 text-xs font-medium text-muted-foreground">{title}</span>
			</motion.div>
		</AnimatePresence>
	)
}

type NavIconProps = {
	icon: keyof typeof Icons
	className?: string
}
export const NavIcon = ({ icon, className }: NavIconProps) => {
	const Icon = Icons[icon]
	return <Icon className={cn('size-5 flex-shrink-0', className)} />
}

type NavLabelProps = {
	label: string
	className?: string
	disableAnimation?: boolean
}
export const NavLabel = ({ label, className, disableAnimation }: NavLabelProps) => {
	const { isNavOpen } = useNav()
	return (
		<motion.span
			animate={{
				display: isNavOpen ? 'block' : 'none',
				opacity: isNavOpen ? 1 : 0
			}}
			className={cn(
				'whitespace-pre text-sm transition duration-150',
				!isNavOpen && 'hidden',
				!disableAnimation && 'group-hover/navigation:translate-x-1.5',
				className
			)}
		>
			{label}
		</motion.span>
	)
}

export const NavItemSideIcon = ({ className }: IconBaseProps) => {
	const { isNavOpen } = useNav()
	return (
		isNavOpen && (
			<TbArrowRight
				className={cn(
					'ml-auto mr-1.5 size-4 flex-shrink-0 opacity-0 transition duration-150 group-hover/navigation:translate-x-1.5 group-hover/navigation:opacity-100',
					className
				)}
			/>
		)
	)
}
