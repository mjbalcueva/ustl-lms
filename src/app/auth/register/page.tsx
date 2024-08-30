import { type Metadata } from 'next'

import {
	AuthCard,
	AuthCardContent,
	AuthCardFooter,
	AuthCardHeader,
	AuthCardLink,
	AuthCardSeparator
} from '@/client/components/auth/auth-card'
import { RegisterForm } from '@/client/components/auth/forms/register'

export const metadata: Metadata = {
	title: 'Register an account',
	description:
		'Create your account to join the Thomasian community. Experience a seamless registration process and unlock exclusive features.'
}

export default function Page() {
	return (
		<AuthCard>
			<AuthCardHeader title="Welcome, Thomasian!" description="Join our community by creating your account." />
			<AuthCardContent>
				<RegisterForm />
				<AuthCardSeparator separatorText="Or continue with" />
			</AuthCardContent>
			<AuthCardFooter>
				<AuthCardLink href="/auth/login" label="Already have an account?" />
				<AuthCardLink href="/privacy" label="Privacy" className="!ml-auto" />
				<AuthCardLink href="/terms" label="Terms" />
			</AuthCardFooter>
		</AuthCard>
	)
}
