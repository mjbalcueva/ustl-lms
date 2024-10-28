'use client'

import Link from 'next/link'
import * as React from 'react'
import { signOut } from 'next-auth/react'

import { Button, buttonVariants } from '@/core/components/ui/button'
import { Separator } from '@/core/components/ui/separator'
import { cn } from '@/core/lib/utils/cn'

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				'w-full max-w-[400px] overflow-auto rounded-xl border-2 border-border bg-card text-card-foreground shadow-md',
				className
			)}
			{...props}
		/>
	)
)
Card.displayName = 'Card'

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
	)
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h3
		ref={ref}
		className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
		{...props}
	/>
))
CardTitle.displayName = 'CardTitle'

export const CardDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
))
CardDescription.displayName = 'CardDescription'

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn('flex flex-col space-y-6 p-6 pt-0', className)} {...props} />
	)
)
CardContent.displayName = 'CardContent'

export const CardSeparator = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		label: string
	}
>(({ className, label, ...props }, ref) => (
	<div ref={ref} className={cn('relative w-full', className)} {...props}>
		<Separator />
		<div className="absolute left-0 right-0 flex translate-y-[-50%] items-center justify-center">
			<span className="pointer-events-none select-none bg-card px-2 text-xs leading-none text-muted-foreground">
				{label}
			</span>
		</div>
	</div>
))
CardSeparator.displayName = 'CardSeparator'

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn('flex space-x-3 p-6 pb-4 pt-0 font-normal', className)}
			{...props}
		/>
	)
)
CardFooter.displayName = 'CardFooter'

export const CardLink = React.forwardRef<
	HTMLAnchorElement,
	React.ComponentPropsWithoutRef<typeof Link> & { label: string }
>(({ className, label, ...props }, ref) => (
	<Link
		ref={ref}
		className={cn(buttonVariants({ variant: 'link', size: 'link' }), className)}
		{...props}
	>
		{label}
	</Link>
))
CardLink.displayName = 'CardLink'

export const CardLogoutButton = React.forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => (
	<Button
		ref={ref}
		variant="link"
		size="link"
		className={cn(className)}
		onClick={() => signOut({ callbackUrl: '/login' })}
		{...props}
	>
		Logout
	</Button>
))
CardLogoutButton.displayName = 'CardLogoutButton'
