import * as React from 'react'

import { Separator } from '@/client/components/ui'

type CardWrapperProps = React.HTMLAttributes<HTMLDivElement>
export const CardWrapper = ({ ...props }: CardWrapperProps) => {
	return <div className="my-6 rounded-xl border border-border bg-card shadow-sm" {...props} />
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
	withSeparator?: boolean
	children: React.ReactNode
}
export const CardContent = ({ withSeparator, children, ...props }: CardContentProps) => {
	return (
		children && (
			<div className="px-4 pb-4 pt-0 md:px-6" {...props}>
				{withSeparator && <Separator className="mb-4" />}
				{children}
			</div>
		)
	)
}

type CardContentContainerProps = React.HTMLAttributes<HTMLDivElement>
export const CardContentContainer = ({ children, ...props }: CardContentContainerProps) => {
	return (
		<div className="pb-2 text-sm" {...props}>
			{children}
		</div>
	)
}

type CardFooterProps = React.HTMLAttributes<HTMLDivElement>
export const CardFooter = ({ ...props }: CardFooterProps) => {
	return (
		<>
			<div className="flex items-center justify-start px-4 pb-4 md:px-6" {...props} />
		</>
	)
}
