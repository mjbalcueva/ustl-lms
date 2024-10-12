import { redirect } from 'next/navigation'
import { TbListDetails, TbNotebook, TbPackage } from 'react-icons/tb'

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
import {
	Banner,
	PageBreadcrumbs,
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageSectionTitle,
	PageTitle,
	PageWrapper,
	Separator
} from '@/client/components/ui'

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
		course.categoryId,
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

			<PageHeader className="flex items-center justify-between space-y-0">
				<div className="space-y-2">
					<PageTitle>Course Setup</PageTitle>
					<PageDescription>Filled {completionText}</PageDescription>
				</div>
				<CourseActions id={course.id} status={course.status} />
			</PageHeader>

			<PageContent className="gap-4 px-2.5 sm:px-4 md:flex md:flex-wrap md:gap-6 md:px-6">
				<PageSection className="mb-6 flex-1 md:mb-0" compactMode>
					<PageSectionTitle title="Customize your course" icon={TbNotebook} />
					<EditCourseCodeForm id={course.id} code={course.code} />
					<EditCourseTitleForm id={course.id} title={course.title} />
					<EditCourseDescriptionForm id={course.id} description={course.description} />
					<EditCourseImageForm id={course.id} imageUrl={course.imageUrl} />
					<EditCourseCategoriesForm
						id={course.id}
						categoryId={course.categoryId}
						options={categories.map((category) => ({ value: category.id, label: category.name }))}
					/>
				</PageSection>

				<div className="flex flex-1 flex-col gap-4 md:gap-6">
					<PageSection compactMode>
						<PageSectionTitle title="Course Outline" icon={TbListDetails} />
						<AddCourseChaptersForm courseId={course.id} chapters={course.chapters} />
					</PageSection>

					<PageSection compactMode>
						<PageSectionTitle title="Additional References" icon={TbPackage} />
						<AddCourseAttachmentsForm courseId={course.id} attachments={course.attachments} />
					</PageSection>
				</div>
			</PageContent>
		</PageWrapper>
	)
}
