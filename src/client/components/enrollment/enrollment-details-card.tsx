'use client'

import Image from 'next/image'
import { type Category } from '@prisma/client'

import { Avatar, AvatarFallback, AvatarImage } from '@/client/components/ui/avatar'
import { Badge } from '@/client/components/ui/badge'
import { Button } from '@/client/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/client/components/ui/card'
import { Icons } from '@/client/components/ui/icons'

type EnrollmentDetailsCardProps = {
	title: string
	description: string | null
	categories: Category[]
	image: string | null
	code: string
	instructorName: string | null | undefined
	instructorImage: string | null | undefined
}

export const EnrollmentDetailsCard = ({
	title,
	description,
	categories,
	image,
	code,
	instructorName,
	instructorImage
}: EnrollmentDetailsCardProps) => {
	const handleEnroll = () => {
		console.log('Enroll')
	}

	return (
		<Card className="flex w-full max-w-md flex-col">
			<CardHeader className="flex items-center justify-normal gap-2">
				<CardTitle className="text-xl">{title ?? 'Class Details'}</CardTitle>
				<Badge variant="outline">{code ?? 'N/A'}</Badge>
			</CardHeader>

			<CardContent className="flex-1 space-y-4">
				{image ? (
					<div className="relative aspect-video h-40 w-full">
						<Image
							src={image}
							alt="Course Image"
							fill
							className="rounded-md object-cover"
							priority
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>
					</div>
				) : (
					<div className="flex h-40 w-full items-center justify-center rounded-md bg-muted">
						<Icons.image className="size-10 text-muted-foreground" />
					</div>
				)}

				<div className="space-y-0.5">
					<span className="block font-semibold">Description</span>
					<CardDescription>{description ?? 'No description available'}</CardDescription>
				</div>

				<div className="space-y-0.5">
					<span className="block font-semibold">Categories</span>
					<div className="flex flex-wrap gap-2">
						{categories && categories.length > 0 ? (
							categories.map((category) => (
								<Badge key={category.id} variant="secondary">
									{category.name}
								</Badge>
							))
						) : (
							<Badge variant="outline">No categories</Badge>
						)}
					</div>
				</div>

				<div className="space-y-1">
					<span className="block font-semibold">Taught By</span>
					<div className="flex items-center space-x-2">
						{instructorImage ? (
							<Avatar className="size-7">
								<AvatarImage src={instructorImage} alt={instructorName ?? 'Instructor'} />
								<AvatarFallback>{instructorName?.[0] ?? 'I'}</AvatarFallback>
							</Avatar>
						) : (
							<div className="flex size-10 items-center justify-center rounded-full bg-muted">
								<Icons.instructor className="size-6 text-muted-foreground" />
							</div>
						)}

						<div className="flex flex-col -space-y-1">
							<span className="text-sm font-medium">{instructorName ?? 'Unknown Instructor'}</span>
							<span className="text-xs text-muted-foreground">Instructor</span>
						</div>
					</div>
				</div>
			</CardContent>

			<CardFooter>
				<Button onClick={handleEnroll} variant="default" className="w-full">
					Enroll
				</Button>
			</CardFooter>
		</Card>
	)
}
