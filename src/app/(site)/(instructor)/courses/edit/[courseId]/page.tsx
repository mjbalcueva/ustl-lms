import { TbBook2, TbListDetails, TbPackage } from 'react-icons/tb'

import { api, HydrateClient } from '@/shared/trpc/server'
import { type Breadcrumb } from '@/shared/types/breadcrumbs'

import { CategoryEdit } from '@/client/components/course/forms/category-edit'
import { CodeEdit } from '@/client/components/course/forms/code-edit'
import { DescriptionEdit } from '@/client/components/course/forms/description-edit'
import { ImageEdit } from '@/client/components/course/forms/image-edit'
import { TitleEdit } from '@/client/components/course/forms/title-edit'
import { CreateChapters } from '@/client/components/instructor/course/forms/create-chapters'
import { UpdateAttachment } from '@/client/components/instructor/course/forms/update-attachment'
import { NotFound } from '@/client/components/not-found'
import {
	PageBreadcrumbs,
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageSectionTitle,
	PageTitle,
	PageWrapper
} from '@/client/components/page'
import { Separator } from '@/client/components/ui'

export default async function Page({ params }: { params: { courseId: string } }) {
	const { course } = await api.course.getCourse({ courseId: params.courseId })
	const { categories } = await api.category.getCategories()

	if (!course) return <NotFound />

	const crumbs: Breadcrumb = [
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
					<PageBreadcrumbs crumbs={crumbs} />
				</PageHeader>

				<Separator className="hidden md:block" />

				<PageHeader>
					<PageTitle className="font-bold">Course Setup</PageTitle>
					<PageDescription>Completed {completionText}</PageDescription>
				</PageHeader>

				<PageContent className="gap-4 px-2.5 sm:px-4 md:flex md:flex-wrap md:gap-6 md:px-6">
					<PageSection className="mb-6 flex-1 md:mb-0" compactMode>
						<PageSectionTitle title="Customize your course" icon={TbBook2} />
						<CodeEdit courseId={course.id} initialData={{ code: course.code }} />
						<TitleEdit courseId={course.id} initialData={{ title: course.title }} />
						<DescriptionEdit courseId={course.id} initialData={{ description: course.description ?? '' }} />
						<ImageEdit courseId={course.id} initialData={{ image: course.image ?? '' }} />
						<CategoryEdit
							courseId={course.id}
							categoryId={course.categoryId ?? ''}
							options={categories.map((category) => ({ value: category.id, label: category.name }))}
						/>
					</PageSection>

					<div className="flex flex-1 flex-col gap-4 md:gap-6">
						<PageSection compactMode>
							<PageSectionTitle title="Course chapters" icon={TbListDetails} />
							<CreateChapters courseId={course.id} initialData={{ chapters: course.chapter }} />
						</PageSection>

						<PageSection compactMode>
							<PageSectionTitle title="Resources & Attachments" icon={TbPackage} />
							<UpdateAttachment courseId={course.id} initialData={{ attachment: course.attachment }} />
						</PageSection>
					</div>
				</PageContent>
			</PageWrapper>
		</HydrateClient>
	)
}
