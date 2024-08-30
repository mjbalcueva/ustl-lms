import * as React from 'react'

import { Separator } from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

export const AuthCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn('w-[400px] rounded-lg border-2 border-border bg-card text-card-foreground shadow-md', className)}
			{...props}
		/>
	)
)
AuthCard.displayName = 'AuthCard'

export const AuthCardHeader = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		title: string
		description: string
	}
>(({ title, description, className, ...props }, ref) => (
	<div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
		<h3 ref={ref} className={cn('text-2xl font-semibold leading-none tracking-tight', className)}>
			{title}
		</h3>
		<p ref={ref} className={cn('text-sm text-muted-foreground', className)}>
			{description}
		</p>
	</div>
))
AuthCardHeader.displayName = 'AuthCardHeader'

export const AuthCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn('flex flex-col space-y-6 p-6 pt-0', className)} {...props} />
	)
)
AuthCardContent.displayName = 'AuthCardContent'

export const AuthCardSeparator = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		separatorText: string
	}
>(({ className, separatorText, ...props }, ref) => (
	<div ref={ref} className={cn('relative w-full', className)} {...props}>
		<Separator />
		<div className="absolute left-0 right-0 flex translate-y-[-50%] items-center justify-center">
			<span className="pointer-events-none select-none bg-card px-2 text-xs leading-none text-muted-foreground">
				{separatorText}
			</span>
		</div>
	</div>
))
AuthCardSeparator.displayName = 'AuthCardSeparator'

export const AuthCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn('flex items-center justify-between p-6 pb-4 pt-0 font-normal', className)}
			{...props}
		/>
	)
)
AuthCardFooter.displayName = 'AuthCardFooter'