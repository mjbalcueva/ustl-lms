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
				'group/navigation mb-1.5 flex items-center justify-start gap-3 rounded-md border-background px-5 py-2 outline-none ring-offset-background hover:border-border focus-visible:ring-2 focus-visible:ring-ring dark:border-transparent sm:px-7 md:border md:px-3 md:hover:bg-card md:hover:shadow-[0_0_0_-2px_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.05)] dark:md:hover:border-border dark:md:hover:bg-accent/70',
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
				'group/navigation mb-1.5 flex items-center justify-start gap-3 rounded-md border border-background px-5 py-2 outline-none ring-offset-background hover:border-border focus-visible:ring-2 focus-visible:ring-ring dark:border-transparent md:px-3 md:hover:bg-card md:hover:shadow-[0_0_0_-2px_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.05)] dark:md:hover:border-border dark:md:hover:bg-accent/70',
				className
			)}
			{...props}
		/>
	)
})
NavButton.displayName = 'NavButton'

type NavTooltipProps = React.ComponentProps<typeof Tooltip> & {
	content: React.ReactNode
}
export const NavTooltip = ({ children, content, ...props }: NavTooltipProps) => {
	const { isNavOpen } = useNav()
	if (isNavOpen) return <>{children}</>
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
				initial={{
					height: isNavOpen ? '2rem' : 0,
					opacity: isNavOpen ? 1 : 0
				}}
				animate={{
					height: isNavOpen ? '2rem' : 0,
					opacity: isNavOpen ? 1 : 0
				}}
				exit={{
					height: isNavOpen ? '2rem' : 0,
					opacity: isNavOpen ? 0 : 1
				}}
				className="flex overflow-hidden rounded-lg"
				{...props}
			>
				<span className="min-w-[224px] select-none px-3 py-2 text-xs font-medium text-muted-foreground">{title}</span>
			</motion.div>
		</AnimatePresence>
	)
}

type NavIconProps = {
	icon?: keyof typeof Icons
	className?: string
}
export const NavIcon = ({ icon, className }: NavIconProps) => {
	if (!icon) return null
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
			animate={{ opacity: isNavOpen ? 1 : 0 }}
			className={cn(
				'overflow-hidden whitespace-pre text-sm transition duration-150',
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
