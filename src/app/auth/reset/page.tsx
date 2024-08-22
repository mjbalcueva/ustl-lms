import { Suspense } from 'react'

import { ResetForm } from '@/client/components/auth'

export default function Page() {
	return (
		<Suspense>
			<ResetForm />
		</Suspense>
	)
}
