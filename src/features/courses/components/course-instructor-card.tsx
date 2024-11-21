import { Avatar, AvatarFallback, AvatarImage } from '@/core/components/ui/avatar'
import { Button } from '@/core/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/core/components/ui/card'
import { Facebook, LinkedIn } from '@/core/lib/icons'

type CourseInstructorCardProps = {
	name: string
	bio: string
	email: string
	imageUrl: string
}

export default function CourseInstructorCard({
	name,
	bio,
	email,
	imageUrl
}: CourseInstructorCardProps) {
	return (
		<Card>
			<CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
				<CardTitle className="text-sm font-semibold">About the instructor</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col items-start gap-3">
				<div className="flex items-center gap-2">
					<Avatar className="size-12 rounded-md">
						<AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
						<AvatarImage src={imageUrl} />
					</Avatar>

					<div>
						<CardTitle className="text-base font-semibold">{name}</CardTitle>
						<CardDescription className="text-sm">{email}</CardDescription>
					</div>
				</div>

				<div>
					<CardTitle className="text-sm text-muted-foreground">Bio</CardTitle>
					<CardDescription className="text-sm text-foreground">{bio}</CardDescription>
				</div>

				<div className="flex items-center gap-2">
					<Button variant="secondary" className="size-10 border border-primary">
						<LinkedIn className="!size-4 shrink-0" />
					</Button>

					<Button variant="secondary" className="size-10 border border-primary">
						<Facebook className="!size-4 shrink-0" />
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
