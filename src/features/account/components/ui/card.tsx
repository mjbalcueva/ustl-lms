import * as React from 'react'

import { Separator } from '@/core/components/ui/separator'
import { cn } from '@/core/lib/utils/cn'

export const Card = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			'rounded-xl border bg-card text-card-foreground shadow-sm',
			className
		)}
		{...props}
	/>
))
Card.displayName = 'Card'

export const CardHeader = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn('flex flex-col space-y-1.5 p-4 pt-6 md:px-6', className)}
		{...props}
	/>
))
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<h3
		ref={ref}
		className={cn(
			'w-fit text-lg font-medium leading-none tracking-tight',
			className
		)}
		{...props}
	/>
))
CardTitle.displayName = 'CardTitle'

export const CardDescription = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn('w-fit text-sm text-foreground', className)}
		{...props}
	/>
))
CardDescription.displayName = 'CardDescription'

type CardContentProps = React.HTMLAttributes<HTMLDivElement> & {
	withSeparator?: boolean
}
export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
	({ className, children, withSeparator, ...props }, ref) => (
		<div
			ref={ref}
			className={cn('p-4 pt-0 md:px-6 md:pt-0', className)}
			{...props}
		>
			{withSeparator && <Separator className="mb-4" />}
			{children}
		</div>
	)
)
CardContent.displayName = 'CardContent'

export const CardInnerCard = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn('rounded-lg border px-4 py-2 md:py-3', className)}
		{...props}
	/>
))
CardInnerCard.displayName = 'ItemInnerCard'

export const CardFooter = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<>
		<Separator />
		<div
			ref={ref}
			className={cn('flex items-center px-4 py-2 md:px-6', className)}
			{...props}
		/>
	</>
))
CardFooter.displayName = 'CardFooter'

export const CardFooterDescription = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn('flex items-center text-sm text-muted-foreground', className)}
		{...props}
	/>
))
CardFooterDescription.displayName = 'CardFooterDescription'
