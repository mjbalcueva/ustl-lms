'use client'

import React from 'react'
import { useTheme } from 'next-themes'
import { Toaster as ToasterPrimitive, type ToasterProps } from 'sonner'

import { buttonVariants } from '@/core/components/ui/button'
import { Loader } from '@/core/components/ui/loader'
import { Error, Info, Success, Warning } from '@/core/lib/icons'
import { cn } from '@/core/lib/utils/cn'

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = 'system' } = useTheme()
	return (
		<ToasterPrimitive
			theme={theme as ToasterProps['theme']}
			className="toaster group"
			icons={{
				info: <Info className="size-4" />,
				success: <Success className="size-4" />,
				warning: <Warning className="size-4" />,
				error: <Error className="size-4" />,
				loading: <Loader />
			}}
			toastOptions={{
				unstyled: true,
				closeButton: true,
				classNames: {
					toast: cn(
						'bg-background ring-1 ring-border dark:ring-inset sm:min-w-[22rem] rounded-xl text-foreground overflow-hidden text-sm backdrop-blur-sm px-4 py-3 font-normal sm:px-5 sm:py-4',
						'[&:has([data-icon])_[data-content]]:ml-5',
						'[&:has([data-button])_[data-close-button="true"]]:hidden',
						'[&:not([data-description])_[data-title]]:font-normal',
						'[&:has([data-description])_[data-title]]:!font-medium [&:has([data-description])_[data-title]]:!text-lg',
						'[&>[data-button]]:absolute [&>[data-button=true]]:bottom-4',
						'[&>[data-action=true]]:right-4',
						'[&>[data-cancel=true]]:left-4'
					),
					icon: 'absolute top-1/2 -translate-y-1/2',
					content:
						'[&:not(:has(+button))]:pr-10 [&:has(+button)]:pb-11 md:[&:has(+button)]:pb-9',
					error:
						'!bg-red-300/80 dark:!bg-red-400/70 !text-red-900 dark:!text-red-950 ring-black/20 dark:ring-white/10 dark:ring-inset [&>[data-close-button=true]:hover]:bg-white/20 dark:[&>[data-close-button=true]:hover]:bg-white/10 [&>[data-close-button=true]>svg]:text-red-900 dark:[&>[data-close-button=true]>svg]:text-red-950',
					info: '!bg-blue-300/80 dark:!bg-blue-400/70 !text-blue-900 dark:!text-blue-950 ring-black/20 dark:ring-white/10 dark:ring-inset [&>[data-close-button=true]:hover]:bg-white/20 dark:[&>[data-close-button=true]:hover]:bg-white/10 [&>[data-close-button=true]>svg]:text-blue-900 dark:[&>[data-close-button=true]>svg]:text-blue-950',
					warning:
						'!bg-yellow-200/80 dark:!bg-yellow-300/70 !text-yellow-900 dark:!text-yellow-950 ring-black/20 dark:ring-white/10 dark:ring-inset [&>[data-close-button=true]:hover]:bg-white/20 dark:[&>[data-close-button=true]:hover]:bg-white/10 [&>[data-close-button=true]>svg]:text-yellow-900 dark:[&>[data-close-button=true]>svg]:text-yellow-950',
					success:
						'!bg-emerald-300/80 dark:!bg-emerald-400/70 !text-emerald-900 dark:!text-emerald-950 ring-black/20 dark:ring-white/10 dark:ring-inset [&>[data-close-button=true]:hover]:bg-white/20 dark:[&>[data-close-button=true]:hover]:bg-white/10 [&>[data-close-button=true]>svg]:text-emerald-900 dark:[&>[data-close-button=true]>svg]:text-emerald-950',
					cancelButton: buttonVariants({
						size: 'sm'
					}),
					actionButton: buttonVariants({
						className: 'self-end justify-self-end',
						size: 'sm'
					}),
					closeButton:
						'[&_svg]:size-5 size-8 absolute top-1/2 transform -translate-y-1/2 right-2 lg:right-3 left-auto grid place-content-center rounded-md hover:bg-black/20 dark:hover:bg-white/20 border-0 [&_svg]:text-foreground'
				}
			}}
			{...props}
		/>
	)
}

export { Toaster }
