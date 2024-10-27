import { type Metadata } from 'next'

import { LoginForm } from '@/features/auth/components/forms/login-form'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardLink,
	CardSeparator,
	CardTitle
} from '@/features/auth/components/ui/card'
import { OAuthButton } from '@/features/auth/components/ui/oauth-button'

export const metadata: Metadata = {
	title: 'Log in to your account',
	description:
		'Access your Thomasian account securely. Connect with our vibrant community, manage your profile, and explore exclusive features for University of Santo Tomas-Legazpi students.'
}

export default function LoginPage({ searchParams }: { searchParams: { callbackUrl?: string } }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Welcome Back, Thomasian!</CardTitle>
				<CardDescription>
					Log in to access your account and connect with our community.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<LoginForm />
				<CardSeparator label="Or continue with" />
				<OAuthButton
					provider="google"
					label="Login with Google"
					callbackUrl={searchParams.callbackUrl}
				/>
			</CardContent>
			<CardFooter>
				<CardLink href="/register" label="Don't have an account?" />
				<CardLink href="/privacy" label="Privacy" className="!ml-auto" />
				<CardLink href="/terms" label="Terms" />
			</CardFooter>
		</Card>
	)
}
