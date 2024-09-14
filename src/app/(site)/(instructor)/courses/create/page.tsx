import { CreateCourseForm } from '@/client/components/instructor/course/forms/create-course'
import { PageContainer, PageContent, PageWrapper } from '@/client/components/page-wrapper'

export default function Page() {
	return (
		<PageWrapper>
			<PageContainer className="h-full">
				<PageContent className="grid h-full pt-6 md:place-items-center">
					<CreateCourseForm />
				</PageContent>
			</PageContainer>
		</PageWrapper>
	)
}
