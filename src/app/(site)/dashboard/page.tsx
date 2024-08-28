import { api, HydrateClient } from '@/shared/trpc/server'

import { PageWrapper } from '@/client/components/page-wrapper'

export default async function Page() {
	void api.post.getLatest.prefetch()

	return (
		<HydrateClient>
			<PageWrapper></PageWrapper>
		</HydrateClient>
	)
}
