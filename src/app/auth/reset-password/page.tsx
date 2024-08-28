import { Suspense } from 'react'

import { ResetPasswordForm } from '@/client/components/auth/forms/reset-password'

export default function Page() {
	return (
		<Suspense>
			<ResetPasswordForm />
		</Suspense>
	)
}
