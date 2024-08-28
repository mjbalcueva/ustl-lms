import { Suspense } from 'react'

import { VerifyEmailForm } from '@/client/components/auth/verify-email-form'

export default function Page() {
	return (
		<Suspense>
			<VerifyEmailForm />
		</Suspense>
	)
}
