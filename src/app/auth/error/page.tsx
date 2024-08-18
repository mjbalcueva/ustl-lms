import { Suspense } from 'react'

import { ErrorCard } from '@/client/components/auth/error-card'

export default function Page() {
	return (
		<Suspense>
			<ErrorCard />
		</Suspense>
	)
}
