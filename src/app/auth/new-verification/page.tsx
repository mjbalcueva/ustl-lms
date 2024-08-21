import { Suspense } from 'react'

import { NewVerificationCard } from '@/client/components/auth/new-verification-card'

export default function Page() {
	return (
		<Suspense>
			<NewVerificationCard />
		</Suspense>
	)
}
