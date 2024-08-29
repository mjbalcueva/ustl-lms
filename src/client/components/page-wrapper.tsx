import * as React from 'react'

import { cn } from '@/client/lib/utils'

export const PageWrapper = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn('flex-grow overflow-auto border-t border-border bg-background md:rounded-xl md:border', className)}
			{...props}
		/>
	)
)
PageWrapper.displayName = 'PageWrapper'

export const PageContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => <div ref={ref} className={cn('mx-auto w-full max-w-2xl', className)} {...props} />
)
PageContainer.displayName = 'PageContainer'

export const PageHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => <div ref={ref} className={cn('space-y-2 p-4 pt-4 md:p-6', className)} {...props} />
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
	({ className, ...props }, ref) => <div ref={ref} className={cn('p-4 pt-0 md:p-6 md:pt-0', className)} {...props} />
)
PageContent.displayName = 'PageContent'
