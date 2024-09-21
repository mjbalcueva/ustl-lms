import { api } from '@/shared/trpc/server'

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

export default async function Page({ params }: { params: { courseId: string; chapterId: string } }) {
	const { chapter } = await api.chapter.getChapter({ chapterId: params.chapterId })
	if (!chapter) return <NotFound />

	const crumbs: Crumb[] = [
		{ icon: 'instructor' },
		{ label: 'Courses', href: '/courses' },
		{ label: 'Edit' },
		{ icon: 'publishedCourse', label: chapter.course.title, href: `/courses/edit/${chapter.course.id}` },
		{ label: 'Chapters' },
		{ icon: 'chapter', label: chapter.title }
	]

	return (
		<PageWrapper>
			<PageHeader className="hidden space-y-0 md:block md:py-3">
				<Breadcrumbs crumbs={crumbs} />
			</PageHeader>

			<Separator className="hidden md:block" />

			<PageHeader>
				<PageTitle>Chapter</PageTitle>
				<PageDescription>Edit chapter</PageDescription>
			</PageHeader>

			<PageContent>
				<PageSection>
					<pre>{JSON.stringify(chapter, null, 2)}</pre>
				</PageSection>
			</PageContent>
		</PageWrapper>
	)
}
