'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { api, type RouterOutputs } from '@/services/trpc/react'

import { Badge } from '@/core/components/ui/badge'
import { Button } from '@/core/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/core/components/ui/card'
import { Image as ImageIcon } from '@/core/lib/icons'

export const EnrollmentDetailsCard = ({
	course: {
		courseId,
		code,
		title,
		description,
		tags,
		imageUrl,
		instructorName,
		token
	}
}: {
	course: RouterOutputs['student']['courseEnrollment']['findOneCourse']['course']
}) => {
	const router = useRouter()

	const { mutate, isPending } =
		api.student.courseEnrollment.enrollToCourse.useMutation({
			onSuccess: (data) => {
				toast.success(data.message)
				router.refresh()
				router.push(`/courses/${courseId}`)
			},
			onError: (error) => toast.error(error.message)
		})

	return (
		<Card className="flex w-full max-w-md flex-col overflow-hidden">
			{imageUrl ? (
				<div className="relative aspect-video max-h-[240px] w-full">
					<Image
						src={imageUrl}
						alt="Course Image"
						fill
						className="object-cover dark:[mask-image:linear-gradient(to_top,transparent,black_20%)]"
						priority
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				</div>
			) : (
				<div className="flex aspect-video w-full items-center justify-center bg-muted">
					<ImageIcon className="size-16 text-muted-foreground" />
				</div>
			)}

			<CardHeader className="flex-col items-start p-6">
				<div className="flex items-center justify-between gap-2">
					<CardTitle className="text-2xl font-bold leading-tight">
						{title ?? 'Class Details'}
					</CardTitle>
					<Badge variant="outline" className="shrink-0 font-medium">
						{code ?? 'N/A'}
					</Badge>
				</div>
				{instructorName && (
					<span className="text-sm text-muted-foreground">
						by{' '}
						<span className="font-medium text-foreground">
							{instructorName}
						</span>
					</span>
				)}
			</CardHeader>

			<CardContent className="flex-1 space-y-6 px-6 pb-6">
				<div className="space-y-1">
					<h4 className="font-semibold">Description</h4>
					<CardDescription className="line-clamp-3 text-sm leading-relaxed">
						{description ?? 'No description available'}
					</CardDescription>
				</div>

				<div className="space-y-1">
					<h4 className="font-semibold">Tags</h4>
					<div className="flex flex-wrap gap-2">
						{tags && tags.length > 0 ? (
							tags.map((tag) => (
								<Badge key={tag.tagId} variant="secondary" className="text-xs">
									{tag.name}
								</Badge>
							))
						) : (
							<Badge variant="outline" className="text-xs">
								No tags
							</Badge>
						)}
					</div>
				</div>
			</CardContent>

			<CardFooter>
				<Button
					type="submit"
					variant={isPending ? 'shine' : 'default'}
					className="w-full"
					onClick={() => mutate({ token: token ?? '' })}
					disabled={isPending}
				>
					{isPending ? 'Enrolling...' : 'Enroll Now'}
				</Button>
			</CardFooter>
		</Card>
	)
}
