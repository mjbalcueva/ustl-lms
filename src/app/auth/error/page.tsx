import { Suspense } from 'react'

import { ErrorCard } from '@/client/components/auth'

export default function Page() {
	return (
		<Suspense>
			<ErrorCard />
		</Suspense>
	)
}
