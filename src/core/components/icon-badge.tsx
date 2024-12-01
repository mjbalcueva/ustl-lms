import { cva, type VariantProps } from 'class-variance-authority'
import { type IconType } from 'react-icons'

import { cn } from '@/core/lib/utils/cn'

const backgroundVariants = cva(
	'rounded-full flex items-center justify-center',
	{
		variants: {
			variant: {
				default: 'bg-secondary',
				success: 'bg-emerald-100 dark:bg-emerald-900',
				info: 'bg-sky-100 dark:bg-sky-900'
			},
			size: {
				lg: 'p-2',
				default: 'p-2',
				sm: 'p-1'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
)

const iconVariants = cva('', {
	variants: {
		variant: {
			default: 'text-secondary-foreground',
			success: 'text-emerald-700 dark:text-emerald-300',
			info: 'text-sky-700 dark:text-sky-300'
		},
		size: {
			lg: 'size-6',
			default: 'size-4',
			sm: 'size-2'
		}
	},
	defaultVariants: {
		variant: 'default',
		size: 'default'
	}
})

type BackgroundVariantsProps = VariantProps<typeof backgroundVariants>
type IconVariantsProps = VariantProps<typeof iconVariants>

type IconBadgeProps = BackgroundVariantsProps &
	IconVariantsProps & { icon: IconType }

export const IconBadge = ({ icon: Icon, variant, size }: IconBadgeProps) => {
	return (
		<span className={cn(backgroundVariants({ variant, size }))}>
			<Icon className={cn(iconVariants({ variant, size }))} />
		</span>
	)
}
