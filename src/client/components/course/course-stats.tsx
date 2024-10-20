import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/client/components/ui/card'
import { Icons } from '@/client/components/ui/icons'
import { cn } from '@/client/lib/utils'

type CardStatsMiniProps = {
	icon: keyof typeof Icons
	title: string
	count: number
	className?: string
}

export const CourseStats = ({ icon, title, count, className }: CardStatsMiniProps) => {
	const Icon = Icons[icon]
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
