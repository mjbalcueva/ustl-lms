import * as React from 'react'

import { Separator } from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

export const CardWrapper = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			className={cn(
				'mb-2 min-w-[350px] rounded-xl border border-border bg-card text-card-foreground shadow-sm sm:mb-3 md:mb-4',
				className
			)}
			{...props}
		/>
	)
}

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>
export const CardHeader = ({ ...props }: CardHeaderProps) => {
	return <div className="flex items-center justify-between p-4 font-medium md:px-6" {...props} />
}

type CardTitleProps = React.HTMLAttributes<HTMLDivElement>
export const CardTitle = ({ ...props }: CardTitleProps) => {
	return <h3 className="w-fit text-base font-medium leading-none tracking-tight" {...props} />
}

type CardDescriptionProps = React.HTMLAttributes<HTMLDivElement>
export const CardDescription = ({ ...props }: CardDescriptionProps) => {
	return <p className="text-sm text-foreground" {...props} />
}

type CardContentProps = React.HTMLAttributes<HTMLDivElement> & {
	isEmpty?: boolean
	withSeparator?: boolean
	children: React.ReactNode
}
export const CardContent = ({ isEmpty, withSeparator, children, className, ...props }: CardContentProps) => {
	return (
		children && (
			<div
				className={cn('px-4 pb-4 pt-0 text-sm md:px-6', isEmpty && 'italic text-muted-foreground', className)}
				{...props}
			>
				{withSeparator && <Separator className="mb-4" />}
				{children}
			</div>
		)
	)
}

type CardFooterProps = React.HTMLAttributes<HTMLDivElement>
export const CardFooter = ({ ...props }: CardFooterProps) => {
	return <div className="flex items-center justify-start px-4 pb-4 md:px-6" {...props} />
}
