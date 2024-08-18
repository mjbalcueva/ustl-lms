import { type Metadata } from 'next'
import { Suspense } from 'react'

import { LoginForm } from '@/client/components/auth'

export const metadata: Metadata = {
	title: 'Login',
	description: 'Login to your account'
}

export default function Page() {
	return (
		<Suspense>
			<LoginForm />
		</Suspense>
	)
}
