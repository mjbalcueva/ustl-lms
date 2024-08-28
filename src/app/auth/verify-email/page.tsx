import { Suspense } from 'react'

import { VerifyEmailForm } from '@/client/components/auth/forms/verify-email'

export default function Page() {
	return (
		<Suspense>
			<VerifyEmailForm />
		</Suspense>
	)
}
