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
import { formatCreatedAndEditedDates } from '@/core/lib/utils/format-date'
import { type Breadcrumb } from '@/core/types/breadcrumbs'

export default async function Page({ params }: { params: { courseId: string } }) {
	const { courseId } = params

	const { course } = await api.course.findPublicCourse({ courseId })

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

			<PageHeader className="flex flex-col space-y-3 md:flex-row md:gap-4 md:pt-4">
				<div className="relative hidden aspect-video w-full md:block md:max-w-xs">
					<Image
						src={course.imageUrl ?? '/assets/placeholder.svg'}
						alt={course.title}
						className="rounded-lg border-2 border-accent object-cover"
						fill
						priority
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				</div>

				<div className="flex w-full flex-col space-y-2">
					<PageTitle>{course.title}</PageTitle>
					<div className="flex flex-wrap items-center gap-2">
						{course.categories.map((category) => (
							<Badge key={category.id} variant="secondary">
								{category.name}
							</Badge>
						))}
					</div>
					<PageDescription className="line-clamp-3 md:line-clamp-3">
						{course.description}
					</PageDescription>

					<div className="flex flex-1 items-end">
						<Separator />
					</div>

					<h3 className="text-xs text-muted-foreground">
						{formatCreatedAndEditedDates(course.createdAt, course.updatedAt)}
					</h3>

					<div className="!mt-1 space-y-1">
						<div className="flex justify-between text-sm">
							<span>Course Progress</span>
							<span>25%</span>
						</div>
						<Progress value={25} className="w-full" />
					</div>
				</div>

				<Button>Continue Last</Button>
			</PageHeader>

			<PageContent>
				<PageSection>Rawr</PageSection>
			</PageContent>

			<pre>{JSON.stringify(course, null, 2)}</pre>
		</>
	)
}
