import { type Metadata } from 'next'

import { RegisterForm } from '@/features/auth/components/forms/register-form'
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
	title: 'Register an account',
	description:
		'Create your account to join the Thomasian community. Experience a seamless registration process and unlock exclusive features.'
}

export default function Page({
	searchParams: { callbackUrl }
}: {
	searchParams: { callbackUrl?: string }
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Welcome, Thomasian!</CardTitle>
				<CardDescription>
					Join our community by creating your account.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<RegisterForm />
				<CardSeparator label="Or continue with" />
				<OAuthButton
					provider="google"
					label="Register with Google"
					callbackUrl={callbackUrl}
				/>
			</CardContent>
			<CardFooter>
				<CardLink href="/login" label="Already have an account?" />
				<CardLink href="/privacy" label="Privacy" className="!ml-auto" />
				<CardLink href="/terms" label="Terms" />
			</CardFooter>
		</Card>
	)
}
