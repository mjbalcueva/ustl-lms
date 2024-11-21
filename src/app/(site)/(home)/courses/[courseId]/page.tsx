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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/ui/tabs'
import { CourseSingle, Home } from '@/core/lib/icons'
import { formatDate } from '@/core/lib/utils/format-date'
import { type Breadcrumb } from '@/core/types/breadcrumbs'

import CourseInstructorCard from '@/features/courses/components/course-instructor-card'
import AiChatCard from '@/features/courses/components/tabs/ai-chat/ai-chat-card'
import AttachmentsCard from '@/features/courses/components/tabs/attachments/attachments-card'
import ForumCard from '@/features/courses/components/tabs/forum/forum-card'
import SyllabusCard from '@/features/courses/components/tabs/syllabus/syllabus-card'

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
				<div className="hidden flex-1 md:block md:min-w-[249px] md:max-w-xs">
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

				<div className="flex flex-[2] flex-col space-y-2 md:min-w-[500px]">
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

			<PageContent className="mb-24 space-y-6 px-2.5 pt-6 sm:px-4 md:mb-12 md:flex md:flex-wrap md:gap-6 md:space-y-0 md:px-6">
				<PageSection className="flex-[2] md:min-w-[500px]" columnMode>
					<Tabs defaultValue="syllabus" className="space-y-4">
						<TabsList>
							<TabsTrigger value="syllabus">Syllabus</TabsTrigger>
							<TabsTrigger value="ai-chat">AI Chat</TabsTrigger>
							<TabsTrigger value="forum">Forum</TabsTrigger>
							<TabsTrigger value="attachments">Attachments</TabsTrigger>
						</TabsList>

						<TabsContent value="syllabus">
							<SyllabusCard />
						</TabsContent>

						<TabsContent value="ai-chat">
							<AiChatCard />
						</TabsContent>

						<TabsContent value="forum">
							<ForumCard />
						</TabsContent>

						<TabsContent value="attachments">
							<AttachmentsCard />
						</TabsContent>
					</Tabs>
				</PageSection>

				<PageSection className="md:min-w-[243px]" columnMode>
					<CourseInstructorCard />
				</PageSection>
			</PageContent>
		</>
	)
}
