'use client'

import React from 'react'
import { useTheme } from 'next-themes'
import { Toaster as ToasterPrimitive, type ToasterProps } from 'sonner'
import { twJoin } from 'tailwind-merge'

import { Icons } from '@/client/components/icons'
import { Loader } from '@/client/components/loader'
import { buttonVariants } from '@/client/components/ui'

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = 'system' } = useTheme()
	return (
		<ToasterPrimitive
			theme={theme as ToasterProps['theme']}
			className="toaster group"
			icons={{
				info: <Icons.circleInfoFilled className="size-4" />,
				success: <Icons.circleCheckFilled className="size-4" />,
				warning: <Icons.triangleInfoFilled className="size-4" />,
				error: <Icons.triangleAlertFilled className="size-4" />,
				loading: <Loader />
			}}
			toastOptions={{
				unstyled: true,
				closeButton: true,
				classNames: {
					toast: twJoin(
						'bg-background ring-1 ring-border dark:ring-inset sm:min-w-[22rem] rounded-xl text-foreground overflow-hidden text-sm backdrop-blur-xl px-4 py-3 font-normal sm:px-5 sm:py-5',
						'[&:has([data-icon])_[data-content]]:ml-5',
						'[&:has([data-button])_[data-close-button="true"]]:hidden',
						'[&:not([data-description])_[data-title]]:font-normal',
						'[&:has([data-description])_[data-title]]:!font-medium [&:has([data-description])_[data-title]]:!text-lg',
						'[&>[data-button]]:absolute [&>[data-button=true]]:bottom-4',
						'[&>[data-action=true]]:right-4',
						'[&>[data-cancel=true]]:left-4'
					),
					icon: 'absolute top-1/2 -translate-y-1/2',
					content: '[&:not(:has(+button))]:pr-10 [&:has(+button)]:pb-11 md:[&:has(+button)]:pb-9',
					error:
						'!bg-red-500/30 !text-red-500 ring-white/10 backdrop-blur-xl dark:ring-inset [&>[data-close-button=true]:hover]:bg-white/20 [&>[data-close-button=true]>svg]:text-red-500',
					info: '!bg-blue-500/30 !text-blue-500 ring-white/10 backdrop-blur-xl dark:ring-inset [&>[data-close-button=true]:hover]:bg-white/20 [&>[data-close-button=true]>svg]:text-blue-500',
					warning:
						'!bg-yellow-500/30 !text-yellow-500 ring-white/10 backdrop-blur-xl dark:ring-inset [&>[data-close-button=true]:hover]:bg-white/20 [&>[data-close-button=true]>svg]:text-yellow-500',
					success:
						'!bg-emerald-500/30 !text-emerald-500 ring-white/10 backdrop-blur-xl dark:ring-inset [&>[data-close-button=true]:hover]:bg-white/20 [&>[data-close-button=true]>svg]:text-emerald-500',
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
