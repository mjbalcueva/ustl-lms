import { Suspense } from 'react'

import { ErrorForm } from '@/client/components/auth/forms/error'

export default function Page() {
	return (
		<Suspense>
			<ErrorForm />
		</Suspense>
	)
}
