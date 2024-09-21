import { TbBook2, TbListDetails, TbPackage } from 'react-icons/tb'

import { api, HydrateClient } from '@/shared/trpc/server'

import { CreateChapters } from '@/client/components/instructor/course/forms/create-chapters'
import { UpdateAttachment } from '@/client/components/instructor/course/forms/update-attachment'
import { UpdateCategory } from '@/client/components/instructor/course/forms/update-category'
import { UpdateCode } from '@/client/components/instructor/course/forms/update-code'
import { UpdateDescription } from '@/client/components/instructor/course/forms/update-description'
import { UpdateImage } from '@/client/components/instructor/course/forms/update-image'
import { UpdateTitle } from '@/client/components/instructor/course/forms/update-title'
import { SectionTitle } from '@/client/components/instructor/course/section-title'
import { NotFound } from '@/client/components/not-found'
import {
	Breadcrumbs,
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageTitle,
	PageWrapper,
	type Crumb
} from '@/client/components/page'
import { Separator } from '@/client/components/ui'

export default async function Page({ params }: { params: { courseId: string } }) {
	const { course } = await api.course.getCourse({ courseId: params.courseId })
	const { categories } = await api.category.getCategories()

	if (!course) return <NotFound />

	const crumbs: Crumb[] = [
		{ icon: 'instructor' },
		{ label: 'Courses', href: '/courses' },
		{ label: 'Edit' },
		{ icon: 'draftCourse', label: course.title }
	]

	const requiredFields = [
		course.code,
		course.title,
		course.description,
		course.image,
		course.categoryId,
		course.isPublished,
		course.chapter.some((chapter) => chapter.isPublished)
	]

	const totalFields = requiredFields.length
	const completedFields = requiredFields.filter(Boolean).length
	const completionText = `(${completedFields}/${totalFields})`

	return (
		<HydrateClient>
			<PageWrapper>
				<PageHeader className="hidden space-y-0 md:block md:py-3">
					<Breadcrumbs crumbs={crumbs} />
				</PageHeader>

				<Separator className="hidden md:block" />

				<PageHeader>
					<PageTitle className="font-bold">Course Setup</PageTitle>
					<PageDescription>Completed {completionText}</PageDescription>
				</PageHeader>

				<PageContent className="gap-6 px-2.5 sm:px-4 md:flex md:flex-wrap md:px-6">
					<PageSection className="mb-8 flex-1 !px-0">
						<SectionTitle title="Customize your course" icon={TbBook2} />
						<UpdateCode courseId={course.id} initialData={{ code: course.code }} />
						<UpdateTitle courseId={course.id} initialData={{ title: course.title }} />
						<UpdateDescription courseId={course.id} initialData={{ description: course.description ?? '' }} />
						<UpdateImage courseId={course.id} initialData={{ image: course.image ?? '' }} />
						<UpdateCategory
							courseId={course.id}
							categoryId={course.categoryId ?? ''}
							options={categories.map((category) => ({ value: category.id, label: category.name }))}
						/>
					</PageSection>

					<div className="flex flex-1 flex-col gap-6">
						<PageSection className="!px-0">
							<SectionTitle title="Course chapters" icon={TbListDetails} />
							<CreateChapters courseId={course.id} initialData={{ chapters: course.chapter }} />
						</PageSection>

						<PageSection className="!px-0">
							<SectionTitle title="Resources & Attachments" icon={TbPackage} />
							<UpdateAttachment courseId={course.id} initialData={{ attachment: course.attachment }} />
						</PageSection>
					</div>
				</PageContent>
			</PageWrapper>
		</HydrateClient>
	)
}
