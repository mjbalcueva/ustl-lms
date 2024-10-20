import { type IconType } from 'react-icons'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/core/components/ui/card'
import { cn } from '@/core/lib/utils/cn'

type CourseStatsItemProps = {
	icon: IconType
	title: string
	count: number
	className?: string
}

export const CourseStatsItem = ({ icon: Icon, title, count, className }: CourseStatsItemProps) => {
	return (
		<Card className={cn('!mb-2.5 w-full !min-w-52 overflow-hidden', className)}>
			<CardHeader className="flex-row justify-between pb-2">
				<CardDescription>{title}</CardDescription>
				<Icon className="size-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<CardTitle className="text-3xl">{count}</CardTitle>
			</CardContent>
		</Card>
	)
}
