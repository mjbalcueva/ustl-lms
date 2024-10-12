import { cva, type VariantProps } from 'class-variance-authority'

import { Icons } from '@/client/components/icons'
import { cn } from '@/client/lib/utils'

const bannerVariants = cva('border text-center px-4 py-3 text-sm flex items-center w-full', {
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
})

const iconMap = {
	info: Icons.info,
	success: Icons.success,
	warning: Icons.warning
}

type BannerProps = VariantProps<typeof bannerVariants> & {
	label: string
}

export const Banner = ({ label, variant }: BannerProps) => {
	const Icon = iconMap[variant ?? 'warning']

	return (
		<div className={cn(bannerVariants({ variant }))}>
			<Icon className="mr-2 size-4 shrink-0" />
			{label}
		</div>
	)
}
