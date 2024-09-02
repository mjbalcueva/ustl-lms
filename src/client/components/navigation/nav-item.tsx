import Link from 'next/link'
import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { Icons } from '@/client/components/icons'
import { useNav } from '@/client/lib/hooks/use-nav'
import { cn } from '@/client/lib/utils'

type NavTitleProps = {
	title: string
	isVisible: boolean
}
export const NavTitle = ({ title, isVisible, ...props }: NavTitleProps) => {
	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					className="flex overflow-hidden rounded-lg"
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
}

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

export const NavButton = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
	return (
		<button
			className={cn(
				'group/navigation mb-2 flex items-center justify-start gap-3 rounded-md px-5 py-2 outline-none ring-offset-background hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring sm:px-7 md:px-3 md:hover:bg-accent',
				className
			)}
			{...props}
		/>
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
				'hidden whitespace-pre text-sm transition duration-150',
				!disableAnimation && 'group-hover/navigation:translate-x-1.5',
				className
			)}
		>
			{label}
		</motion.span>
	)
}
