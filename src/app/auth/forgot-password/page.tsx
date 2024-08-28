import { Suspense } from 'react'

import { ForgotPasswordForm } from '@/client/components/auth/forgot-password-form'

export default function Page() {
	return (
		<Suspense>
			<ForgotPasswordForm />
		</Suspense>
	)
}
