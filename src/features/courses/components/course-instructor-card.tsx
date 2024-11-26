import { FoldableBlock } from '@/core/components/foldable-block'
import { Avatar, AvatarFallback, AvatarImage } from '@/core/components/ui/avatar'
import { Button } from '@/core/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/core/components/ui/card'
import { Facebook, LinkedIn, User } from '@/core/lib/icons'

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
		<FoldableBlock
			title="About the Instructor"
			icon={User}
			className="mt-2"
			contentClassName="[&>*:first-child]:mt-4"
			defaultOpen
		>
			<Card>
				<CardHeader className="flex-row items-center gap-4 space-y-0 p-4">
					<Avatar className="size-14 rounded-md border-2 border-border">
						<AvatarFallback className="rounded-none">{name.slice(0, 2)}</AvatarFallback>
						<AvatarImage src={imageUrl} alt={name} />
					</Avatar>

					<div>
						<CardTitle className="text-base tracking-normal">{name}</CardTitle>
						<CardDescription className="text-sm">{email}</CardDescription>
					</div>
				</CardHeader>

				<CardContent className="space-y-2 pb-4">
					<h4 className="text-sm font-medium text-muted-foreground">Bio</h4>
					<CardDescription className="text-sm leading-relaxed text-foreground">
						{bio}
					</CardDescription>
				</CardContent>

				<CardFooter className="flex items-center gap-3 pb-4">
					<Button
						variant="outline"
						size="icon"
						className="size-9 rounded-md transition-colors hover:bg-primary hover:text-primary-foreground"
					>
						<LinkedIn className="size-4" />
					</Button>

					<Button
						variant="outline"
						size="icon"
						className="size-9 rounded-md transition-colors hover:bg-primary hover:text-primary-foreground"
					>
						<Facebook className="size-4" />
					</Button>
				</CardFooter>
			</Card>
		</FoldableBlock>
	)
}
