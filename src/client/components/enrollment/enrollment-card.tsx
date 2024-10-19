'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { api } from '@/shared/trpc/react'
import { type EnrollmentSchema } from '@/shared/validations/enrollment'

import { Badge } from '@/client/components/ui/badge'
import { Button } from '@/client/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/client/components/ui/card'

import { Icons } from '../ui/icons'

export const EnrollmentCard = ({ token }: EnrollmentSchema) => {
	const router = useRouter()

	const { data: course, isLoading } = api.enrollment.findClass.useQuery({ token })

	const handleEnroll = () => {
		router.push('/course-page')
	}

	const { code, title, description, categories, imageUrl: image, instructor } = course ?? {}

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="flex-col items-start">
				<CardTitle className="text-xl">{isLoading ? 'Class Details' : title}</CardTitle>
				<div className="mt-1 flex flex-wrap gap-2">
					{categories && categories.length > 0 ? (
						categories.map((category) => (
							<Badge key={category.id} variant="secondary">
								{category.name}
							</Badge>
						))
					) : (
						<Badge variant="outline">None</Badge>
					)}
				</div>
			</CardHeader>

			<CardContent className="md:pb-6">
				{!isLoading && image && (
					<div className="relative aspect-video">
						<Image
							src={image}
							alt="Course Image"
							fill
							className="rounded-xl border border-input object-cover"
							priority
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>
					</div>
				)}

				{!image && (
					<div className="flex h-[11.5rem] items-center justify-center rounded-xl border border-input bg-card dark:bg-background">
						<Icons.image className="size-10 text-card-foreground dark:text-muted-foreground" />
					</div>
				)}

				<CardDescription className="mt-2">{description ?? 'No description available'}</CardDescription>

				<div className="mt-5 space-y-1 text-sm">
					<div className="flex items-center gap-2">
						<Icons.course className="size-4 text-muted-foreground" />
						<span className="font-medium">Course Code:</span>
						<Badge variant="outline" className="text-muted-foreground">
							{code ?? 'N/A'}
						</Badge>
					</div>
					<div className="flex items-center gap-2">
						<Icons.token className="size-4 text-muted-foreground" />
						<span className="font-medium">Enrollment Token:</span>
						<code className="rounded bg-muted px-1 py-0.5 font-mono text-muted-foreground">{token}</code>
					</div>
					<div className="flex items-center gap-2">
						<Icons.instructor className="size-4 text-muted-foreground" />
						<span className="font-medium">Instructor:</span>
						<span className="text-muted-foreground">{instructor?.profile?.name ?? 'Unknown'}</span>
					</div>
				</div>
			</CardContent>

			<CardFooter>
				<Button onClick={handleEnroll} variant="default" className="w-full rounded-lg" disabled={isLoading}>
					Enroll
				</Button>
			</CardFooter>
		</Card>
	)
}
