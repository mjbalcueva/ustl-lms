import {
	PageDescription,
	PageHeader,
	PageTitle
} from '@/core/components/ui/page'

export default async function Page() {
	return (
		<>
			<PageHeader>
				<PageTitle>Reports</PageTitle>
				<PageDescription>View your reports</PageDescription>
			</PageHeader>
		</>
	)
}
