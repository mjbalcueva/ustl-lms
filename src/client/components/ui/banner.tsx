'use client'

import { useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { TbX } from 'react-icons/tb'

import { Icons } from '@/client/components/ui/icons'
import { cn } from '@/client/lib/utils'

const bannerVariants = cva(
	'border text-center px-4 py-3 text-sm flex backdrop-blur-sm items-center w-full font-medium',
	{
		variants: {
			variant: {
				info: 'bg-blue-200/80 dark:bg-blue-300/60 text-blue-900 dark:text-blue-950 backdrop-blur-xl',
				success: 'bg-emerald-200/80 dark:bg-emerald-300/60 text-emerald-900 dark:text-emerald-950 backdrop-blur-xl',
				warning: 'bg-yellow-200/80 dark:bg-yellow-300/60 text-yellow-900 dark:text-yellow-950 backdrop-blur-xl'
			}
		},
		defaultVariants: {
			variant: 'warning'
		}
	}
)

const iconMap = {
	info: Icons.info,
	success: Icons.success,
	warning: Icons.warning
}

type BannerProps = VariantProps<typeof bannerVariants> & {
	label: string
}

export const Banner = ({ label, variant }: BannerProps) => {
	const [isVisible, setIsVisible] = useState(true)
	const Icon = iconMap[variant ?? 'warning']

	const handleClose = () => {
		setIsVisible(false)
	}

	if (!isVisible) return null

	return (
		<div className={cn(bannerVariants({ variant }), 'relative')}>
			<Icon className="mr-2 size-4 shrink-0" />
			{label}
			<button
				onClick={handleClose}
				className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 hover:bg-black/5"
				aria-label="Close banner"
			>
				<TbX className="size-4" />
			</button>
		</div>
	)
}
