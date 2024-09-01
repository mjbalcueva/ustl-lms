'use client'

import * as React from 'react'
import { forwardRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { cn } from '@/client/lib/utils'

export const NavSection = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, children, ...props }, ref) => {
		return (
			<div ref={ref} className={cn('flex flex-col gap-1 rounded-lg', className)} {...props}>
				{children}
			</div>
		)
	}
)
NavSection.displayName = 'NavSection'

type NavSectionTitleProps = React.ComponentProps<typeof motion.div> & {
	title: string
	isVisible: boolean
}
export const NavSectionTitle = forwardRef<HTMLDivElement, NavSectionTitleProps>(
	({ title, isVisible, ...props }, ref) => {
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
	}
)
NavSectionTitle.displayName = 'NavSectionTitle'
