'use client'

import * as React from 'react'

import { cn } from '@/client/lib/utils'

import { Separator } from '../ui'

export const ItemWrapper = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn('overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm', className)}
			{...props}
		/>
	)
)
ItemWrapper.displayName = 'ItemWrapper'

export const ItemHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn('flex flex-col space-y-1.5 p-4 pt-6', className)} {...props} />
	)
)
ItemHeader.displayName = 'ItemHeader'

export const ItemTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<h3 ref={ref} className={cn('w-fit text-lg font-medium leading-none tracking-tight', className)} {...props} />
	)
)
ItemTitle.displayName = 'ItemTitle'

export const ItemDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<p ref={ref} className={cn('w-fit text-sm text-muted-foreground', className)} {...props} />
	)
)
ItemDescription.displayName = 'ItemDescription'

export const ItemContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, children, ...props }, ref) => (
		<div ref={ref} className={cn('p-4 pt-0', className)} {...props}>
			<Separator className="mb-4" />
			{children}
		</div>
	)
)
ItemContent.displayName = 'ItemContent'

export const ItemInnerCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn('rounded-lg border px-4 py-2', className)} {...props} />
	)
)
ItemInnerCard.displayName = 'ItemInnerCard'

export const ItemFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<>
			<Separator className="h-[0.5px]" />
			<div ref={ref} className={cn('flex items-center px-4 py-2.5', className)} {...props} />
		</>
	)
)
ItemFooter.displayName = 'ItemFooter'
