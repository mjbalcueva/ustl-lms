import { api, HydrateClient } from '@/shared/trpc/server'

import { PageWrapper } from '@/client/components/page-wrapper'

export default async function Page() {
	void api.post.getLatest.prefetch()

	return (
		<HydrateClient>
			<PageWrapper>
				<div className="h-screen bg-red-700">rawr</div>
				<div className="h-screen bg-blue-700">rawr</div>
				<div className="h-screen bg-green-700">rawr</div>
			</PageWrapper>
		</HydrateClient>
	)
}
