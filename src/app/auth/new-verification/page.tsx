import { Suspense } from 'react'

import { NewVerificationCard } from '@/client/components/auth'

export default function Page() {
	return (
		<Suspense>
			<NewVerificationCard />
		</Suspense>
	)
}
