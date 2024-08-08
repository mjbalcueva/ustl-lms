import { type Metadata } from 'next'

import { RegisterForm } from '@/client/components/auth'

export const metadata: Metadata = {
	title: 'Register',
	description: 'Register for an account'
}

export default function Page() {
	return <RegisterForm />
}
