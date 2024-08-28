import { Suspense } from 'react'

import { ErrorForm } from '@/client/components/auth'

export default function Page() {
	return (
		<Suspense>
			<ErrorForm />
		</Suspense>
	)
}
