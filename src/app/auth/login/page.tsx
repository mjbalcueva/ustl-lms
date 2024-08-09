import { type Metadata } from 'next'

import { LoginForm } from '@/client/components/auth'

export const metadata: Metadata = {
	title: 'Login',
	description: 'Login to your account'
}

export default function Page() {
	return <LoginForm />
}
