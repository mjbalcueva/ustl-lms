import Image from 'next/image'

import { api } from '@/services/trpc/server'

import { NotFound } from '@/core/components/error-pages/not-found'
import { Badge } from '@/core/components/ui/badge'
import { Button } from '@/core/components/ui/button'
import {
	PageBreadcrumbs,
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageTitle
} from '@/core/components/ui/page'
import { Progress } from '@/core/components/ui/progress'
import { Separator } from '@/core/components/ui/separator'
import { CourseSingle, Home } from '@/core/lib/icons'
import { formatDate } from '@/core/lib/utils/format-date'
import { type Breadcrumb } from '@/core/types/breadcrumbs'

export default async function Page({ params }: { params: { courseId: string } }) {
	const { courseId } = params

	const { course } = await api.course.findEnrolledCourseDetails({ courseId })

	if (!course) return <NotFound item="course" />
	const crumbs: Breadcrumb = [
		{ icon: Home },
		{ label: 'Learning', href: '/courses' },
		{ icon: CourseSingle, label: course.title, href: `/courses/${courseId}` }
	]

	return (
		<>
			<PageHeader className="hidden space-y-0 md:block md:py-3">
				<PageBreadcrumbs crumbs={crumbs} />
			</PageHeader>

			<Separator className="hidden md:block" />

			<PageHeader className="flex flex-col flex-wrap space-y-3 md:flex-row md:gap-4 md:pt-4">
				<div className="hidden min-w-56 flex-1 md:block md:max-w-xs">
					<div className="relative aspect-video">
						<Image
							src={course.imageUrl ?? '/assets/placeholder.svg'}
							alt={course.title}
							className="rounded-lg border-2 border-accent object-cover"
							fill
							priority
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>
					</div>
				</div>

				<div className="flex min-w-[60vw] flex-1 flex-col space-y-2">
					<div className="flex items-start justify-between">
						<div className="flex flex-col gap-2">
							<PageTitle>{course.title}</PageTitle>
							<div className="flex flex-wrap items-center gap-1">
								<Badge variant="outline">{course.status}</Badge>
								{course.categories.map((category) => (
									<Badge key={category.id} variant="secondary">
										{category.name}
									</Badge>
								))}
							</div>
						</div>
						<Button>Start Course</Button>
					</div>
					<PageDescription className="min-h-16 w-full md:line-clamp-3">
						{course.description}
					</PageDescription>

					<div className="flex flex-1 items-end">
						<Separator />
					</div>

					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<h4>
							<span className="font-medium">Created:</span>{' '}
							<span className="underline-offset-2 hover:underline">
								{formatDate(course.createdAt)}
							</span>
						</h4>
						<Separator orientation="vertical" />
						<h4>
							<span className="font-medium">Edited:</span>{' '}
							<span className="underline-offset-2 hover:underline">
								{formatDate(course.updatedAt)}
							</span>
						</h4>
					</div>

					<div className="!mt-1 space-y-1">
						<div className="flex justify-between text-sm">
							<span>Course Progress</span>
							<span>{course.progress}%</span>
						</div>
						<Progress value={course.progress} className="w-full" />
					</div>
				</div>
			</PageHeader>

			<Separator />

			<PageContent>
				<PageSection>Rawr</PageSection>
			</PageContent>
		</>
	)
}
