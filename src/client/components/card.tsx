import * as React from 'react'

import { cn } from '@/client/lib/utils'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			'mb-2 min-w-[350px] overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm sm:mb-3 md:mb-4',
			className
		)}
		{...props}
	/>
))
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn('flex items-center justify-between p-4 font-medium md:px-6', className)} {...props} />
	)
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
	({ className, ...props }, ref) => (
		<h3 ref={ref} className={cn('w-fit font-medium leading-none tracking-tight', className)} {...props} />
	)
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
	({ className, ...props }, ref) => (
		<p ref={ref} className={cn('w-fit text-sm text-muted-foreground', className)} {...props} />
	)
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { isEmpty?: boolean }>(
	({ isEmpty, className, ...props }, ref) =>
		props.children && (
			<div
				ref={ref}
				className={cn('px-4 pb-4 pt-0 text-sm md:px-6', isEmpty && 'italic text-muted-foreground', className)}
				{...props}
			/>
		)
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn('flex items-center justify-start px-4 pb-4 md:px-6', className)} {...props} />
	)
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }