import { type Metadata } from 'next'

import {
	AuthCard,
	AuthCardContent,
	AuthCardFooter,
	AuthCardHeader,
	AuthCardLink,
	AuthCardSeparator
} from '@/client/components/auth/auth-card'
import { LoginForm } from '@/client/components/auth/forms/login'
import { OAuthButton } from '@/client/components/auth/oauth-button'

export const metadata: Metadata = {
	title: 'Log in to your account',
	description:
		'Access your Thomasian account securely. Connect with our vibrant community, manage your profile, and explore exclusive features for University of Santo Tomas-Legazpi students.'
}

export default function LoginPage({ searchParams }: { searchParams: { callbackUrl?: string } }) {
	return (
		<AuthCard>
			<AuthCardHeader
				title="Welcome Back, Thomasian!"
				description="Log in to access your account and connect with our community."
			/>
			<AuthCardContent>
				<LoginForm />
				<AuthCardSeparator label="Or continue with" />
				<OAuthButton provider="google" label="Continue with Google" callbackUrl={searchParams.callbackUrl} />
			</AuthCardContent>
			<AuthCardFooter>
				<AuthCardLink href="/auth/register" label="Don't have an account?" />
				<AuthCardLink href="/privacy" label="Privacy" className="!ml-auto" />
				<AuthCardLink href="/terms" label="Terms" />
			</AuthCardFooter>
		</AuthCard>
	)
}
