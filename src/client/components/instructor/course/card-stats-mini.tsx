import { Icons } from '@/client/components/icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/client/components/ui'

type CardStatsMiniProps = {
	icon: keyof typeof Icons
	title: string
	count: number
}

const CardStatsMini = ({ icon, title, count }: CardStatsMiniProps) => {
	const Icon = Icons[icon]
	return (
		<Card>
			<CardHeader className="flex-row justify-between pb-2">
				<CardDescription>{title}</CardDescription>
				<Icon className="size-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<CardTitle className="text-4xl">{count}</CardTitle>
			</CardContent>
		</Card>
	)
}

export { CardStatsMini }
