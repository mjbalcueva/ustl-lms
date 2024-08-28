import { Suspense } from 'react'

import { ForgotPasswordForm } from '@/client/components/auth/forms/forgot-password'

export default function Page() {
	return (
		<Suspense>
			<ForgotPasswordForm />
		</Suspense>
	)
}
