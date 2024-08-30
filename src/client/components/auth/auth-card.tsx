import Link from 'next/link'
import * as React from 'react'

import { buttonVariants, Separator } from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

export const AuthCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				'w-[400px] overflow-auto rounded-lg border-2 border-border bg-card text-card-foreground shadow-md',
				className
			)}
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
		label: string
	}
>(({ className, label, ...props }, ref) => (
	<div ref={ref} className={cn('relative w-full', className)} {...props}>
		<Separator className="h-[0.5px]" />
		<div className="absolute left-0 right-0 flex translate-y-[-50%] items-center justify-center">
			<span className="pointer-events-none select-none bg-card px-2 text-xs leading-none text-muted-foreground">
				{label}
			</span>
		</div>
	</div>
))
AuthCardSeparator.displayName = 'AuthCardSeparator'

export const AuthCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn('flex space-x-3 p-6 pb-4 pt-0 font-normal', className)} {...props} />
	)
)
AuthCardFooter.displayName = 'AuthCardFooter'

export const AuthCardLink = React.forwardRef<
	HTMLAnchorElement,
	React.ComponentPropsWithoutRef<typeof Link> & { label: string }
>(({ className, label, ...props }, ref) => (
	<Link ref={ref} className={cn(buttonVariants({ variant: 'link', size: 'link' }), className)} {...props}>
		{label}
	</Link>
))
AuthCardLink.displayName = 'AuthCardLink'
