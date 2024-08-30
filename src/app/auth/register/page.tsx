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
import { OAuthButton } from '@/client/components/auth/oauth-button'

export const metadata: Metadata = {
	title: 'Register an account',
	description:
		'Create your account to join the Thomasian community. Experience a seamless registration process and unlock exclusive features.'
}

export default function Page({ searchParams }: { searchParams: { callbackUrl?: string } }) {
	return (
		<AuthCard>
			<AuthCardHeader title="Welcome, Thomasian!" description="Join our community by creating your account." />
			<AuthCardContent>
				<RegisterForm />
				<AuthCardSeparator label="Or continue with" />
				<OAuthButton provider="google" label="Continue with Google" callbackUrl={searchParams.callbackUrl} />
			</AuthCardContent>
			<AuthCardFooter>
				<AuthCardLink href="/auth/login" label="Already have an account?" />
				<AuthCardLink href="/privacy" label="Privacy" className="!ml-auto" />
				<AuthCardLink href="/terms" label="Terms" />
			</AuthCardFooter>
		</AuthCard>
	)
}
