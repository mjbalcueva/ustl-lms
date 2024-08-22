import { Suspense } from 'react'

import { NewPasswordForm } from '@/client/components/auth'

export default function Page() {
	return (
		<Suspense>
			<NewPasswordForm />
		</Suspense>
	)
}
