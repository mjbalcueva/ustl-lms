import { type Metadata } from 'next'
import { Suspense } from 'react'

import { RegisterForm } from '@/client/components/auth/forms/register'

export const metadata: Metadata = {
	title: 'Register',
	description: 'Register for an account'
}

export default function Page() {
	return (
		<Suspense>
			<RegisterForm />
		</Suspense>
	)
}
