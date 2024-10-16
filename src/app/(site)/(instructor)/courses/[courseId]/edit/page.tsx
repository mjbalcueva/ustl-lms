import { redirect } from 'next/navigation'

import { api } from '@/shared/trpc/server'
import { type Breadcrumb } from '@/shared/types/breadcrumbs'

import { AddCourseAttachmentsForm } from '@/client/components/course/forms/add-course-attachments'
import { AddCourseChaptersForm } from '@/client/components/course/forms/add-course-chapters'
import { CourseActions } from '@/client/components/course/forms/course-actions'
import { EditCourseCategoriesForm } from '@/client/components/course/forms/edit-course-categories'
import { EditCourseCodeForm } from '@/client/components/course/forms/edit-course-code'
import { EditCourseDescriptionForm } from '@/client/components/course/forms/edit-course-description'
import { EditCourseImageForm } from '@/client/components/course/forms/edit-course-image'
import { EditCourseTitleForm } from '@/client/components/course/forms/edit-course-title'
import { NotFound } from '@/client/components/not-found'
import { Badge } from '@/client/components/ui/badge'
import { Banner } from '@/client/components/ui/banner'
import { CollapsibleSection } from '@/client/components/ui/collapsible-section'
import {
	PageBreadcrumbs,
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageTitle,
	PageWrapper
} from '@/client/components/ui/page'
import { Separator } from '@/client/components/ui/separator'

export default async function Page({ params }: { params: { courseId: string } }) {
	const session = await api.session.getSession()
	if (session?.user?.role !== 'INSTRUCTOR') redirect('/dashboard')

	const { course } = await api.course.getCourse({ courseId: params.courseId })
	const { categories } = await api.category.getCategories()

	if (!course) return <NotFound item="course" />

	const requiredFields = [
		course.code,
		course.title,
		course.description,
		course.imageUrl,
		course.categories.length > 0,
		course.chapters.some((chapter) => chapter.status === 'PUBLISHED'),
		course.attachments.some((attachment) => !attachment.chapterId)
	]

	const totalFields = requiredFields.length
	const completedFields = requiredFields.filter(Boolean).length
	const completionText = `(${completedFields}/${totalFields})`

	const crumbs: Breadcrumb = [
		{ icon: 'instructor' },
		{ label: 'Courses', href: '/courses/manage' },
		{ icon: 'course', label: course.title, href: `/courses/${course.id}/edit` },
		{ label: 'Edit' }
	]

	return (
		<PageWrapper>
			<PageHeader className="hidden space-y-0 md:block md:py-3">
				<PageBreadcrumbs crumbs={crumbs} />
			</PageHeader>

			<Separator className="hidden md:block" />

			{course.status !== 'PUBLISHED' && (
				<Banner
					label={
						course.status === 'DRAFT'
							? 'This course is not published. It will not be visible to students.'
							: 'This course is archived. It remains accessible to existing students but is hidden from new enrollments.'
					}
					variant={course.status === 'DRAFT' ? 'warning' : 'info'}
				/>
			)}

			<PageHeader className="flex flex-wrap items-center justify-between">
				<div>
					<PageTitle>
						Course Setup
						<Badge variant="outline" className="ml-2">
							{course.status}
						</Badge>
					</PageTitle>
					<PageDescription>Filled {completionText}</PageDescription>
				</div>

				<CourseActions id={course.id} status={course.status} />
			</PageHeader>

			<PageContent className="mb-24 space-y-6 px-2.5 sm:px-4 md:mb-12 md:flex md:flex-wrap md:gap-6 md:space-y-0 md:px-6">
				<PageSection columnMode>
					<CollapsibleSection title="Customize your course" iconName="Tb/TbNotebook">
						<EditCourseCodeForm id={course.id} code={course.code} />
						<EditCourseTitleForm id={course.id} title={course.title} />
						<EditCourseDescriptionForm id={course.id} description={course.description} />
						<EditCourseImageForm id={course.id} imageUrl={course.imageUrl} />
						<EditCourseCategoriesForm
							id={course.id}
							categoryIds={course.categories.map((category) => category.id)}
							options={categories.map((category) => ({ value: category.id, label: category.name }))}
						/>
					</CollapsibleSection>
				</PageSection>

				<PageSection columnMode>
					<CollapsibleSection title="Course Outline" iconName="Tb/TbListDetails">
						<AddCourseChaptersForm courseId={course.id} chapters={course.chapters} />
					</CollapsibleSection>

					<CollapsibleSection title="Additional References" iconName="Tb/TbPackage">
						<AddCourseAttachmentsForm courseId={course.id} attachments={course.attachments} />
					</CollapsibleSection>
				</PageSection>
			</PageContent>
		</PageWrapper>
	)
}
