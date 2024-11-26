import { redirect } from 'next/navigation'
import {
	TbListDetails,
	TbNotebook,
	TbPackage,
	TbUserPlus
} from 'react-icons/tb'

import { auth } from '@/services/authjs/auth'
import { api } from '@/services/trpc/server'

import { NotFound } from '@/core/components/error-pages/not-found'
import { FoldableBlock } from '@/core/components/foldable-block'
import { Badge } from '@/core/components/ui/badge'
import { Banner } from '@/core/components/ui/banner'
import {
	PageBreadcrumbs,
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageTitle
} from '@/core/components/ui/page'
import { Separator } from '@/core/components/ui/separator'
import { CourseSingle, Instructor } from '@/core/lib/icons'
import { type Breadcrumb } from '@/core/types/breadcrumbs'

import { CourseActionButton } from '@/features/courses/instructor/components/course-action-button'
// import { AddCourseAttachmentsForm } from '@/features/courses/components/forms/add-course-attachments-form'
// import { AddCourseChaptersForm } from '@/features/courses/components/forms/add-course-chapters-form'
// import { EditCourseCategoriesForm } from '@/features/courses/components/forms/edit-course-categories'
import { EditCourseCodeForm } from '@/features/courses/instructor/components/forms/edit-course-code-form'
// import { EditCourseDescriptionForm } from '@/features/courses/components/forms/edit-course-description'
// import { EditCourseImageForm } from '@/features/courses/components/forms/edit-course-image'
import { EditCourseTitleForm } from '@/features/courses/instructor/components/forms/edit-course-title-form'
import { EditCourseTokenForm } from '@/features/courses/instructor/components/forms/edit-course-token-form'

export default async function Page({
	params
}: {
	params: { courseId: string }
}) {
	const { courseId } = params

	const session = await auth()
	if (session?.user?.role !== 'INSTRUCTOR') redirect('/dashboard')

	const { course } = await api.instructor.course.findOneCourse({ courseId })
	// const { tags } = await api.instructor.courseTags.findManyCourseTags()

	if (!course) return <NotFound item="course" />

	const requiredFields = [
		course.code,
		course.title,
		course.description,
		course.imageUrl,
		course._count.tags > 0,
		course._count.chapters > 0,
		course._count.attachments > 0
	]

	const totalFields = requiredFields.length
	const completedFields = requiredFields.filter(Boolean).length
	const completionText = `(${completedFields}/${totalFields})`

	const crumbs: Breadcrumb = [
		{ icon: Instructor },
		{ label: 'Courses', href: '/instructor/courses' },
		{
			icon: CourseSingle,
			label: course.title,
			href: `/instructor/courses/${courseId}`
		}
	]

	return (
		<>
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

				<CourseActionButton courseId={course.courseId} status={course.status} />
			</PageHeader>

			<PageContent className="mb-24 space-y-6 px-2.5 sm:px-4 md:mb-12 md:flex md:flex-wrap md:gap-6 md:space-y-0 md:px-6">
				<PageSection columnMode>
					<FoldableBlock title="Course Invite" icon={TbUserPlus}>
						<EditCourseTokenForm
							courseId={course.courseId}
							token={course.token}
						/>
					</FoldableBlock>

					<FoldableBlock
						title="Customize your course"
						icon={TbNotebook}
						duration={0.4}
					>
						<EditCourseCodeForm courseId={course.courseId} code={course.code} />
						<EditCourseTitleForm
							courseId={course.courseId}
							title={course.title}
						/>
						{/* 
						<EditCourseDescriptionForm
							id={course.id}
							description={course.description}
						/>
						<EditCourseImageForm id={course.id} imageUrl={course.imageUrl} />
						<EditCourseCategoriesForm
							id={course.id}
							categories={course.categories}
							categoriesOptions={categories}
						/> */}
					</FoldableBlock>
				</PageSection>

				<PageSection columnMode>
					<FoldableBlock title="Course Outline" icon={TbListDetails}>
						{/* <AddCourseChaptersForm
							courseId={course.id}
							chapters={course.chapters}
						/> */}
					</FoldableBlock>

					<FoldableBlock title="Additional References" icon={TbPackage}>
						{/* <AddCourseAttachmentsForm
							courseId={course.id}
							attachments={course.attachments}
						/> */}
					</FoldableBlock>
				</PageSection>
			</PageContent>
		</>
	)
}
