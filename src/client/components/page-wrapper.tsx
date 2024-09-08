import * as React from 'react'

import { cn } from '@/client/lib/utils'

export const PageWrapper = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<main
			ref={ref}
			className={cn('flex-grow overflow-auto border-border bg-background md:rounded-xl md:border', className)}
			{...props}
		/>
	)
)
PageWrapper.displayName = 'PageWrapper'

export const PageContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn('mx-auto w-full max-w-2xl 2xl:max-w-3xl', className)} {...props} />
	)
)
PageContainer.displayName = 'PageContainer'

export const PageHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<header ref={ref} className={cn('space-y-2 px-2.5 py-4 sm:px-4 md:p-6', className)} {...props} />
	)
)
PageHeader.displayName = 'PageHeader'

export const PageTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<h1 ref={ref} className={cn('w-fit text-2xl font-semibold leading-none tracking-tight', className)} {...props} />
	)
)
PageTitle.displayName = 'PageTitle'

export const PageDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<p ref={ref} className={cn('w-fit text-sm text-muted-foreground', className)} {...props} />
	)
)
PageDescription.displayName = 'PageDescription'

export const PageContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => <div ref={ref} className={cn('px-2.5 sm:px-4 md:px-6', className)} {...props} />
)
PageContent.displayName = 'PageContent'

export const PageSection = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => <section ref={ref} className={cn('pb-2.5 sm:pb-4 md:pb-6', className)} {...props} />
)
PageSection.displayName = 'PageSection'
