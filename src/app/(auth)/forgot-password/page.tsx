import { type Metadata } from 'next'

import { ForgotPasswordForm } from '@/features/auth/components/forms/forgot-password-form'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardLink,
	CardTitle
} from '@/features/auth/components/ui/card'

export const metadata: Metadata = {
	title: 'Forgot Password | Account Recovery',
	description:
		'Securely reset your password. Enter your email address to receive instructions on how to regain access to your account.'
}

export default function Page() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Forgot your password?</CardTitle>
				<CardDescription>
					Enter your email address to reset your password.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ForgotPasswordForm />
			</CardContent>
			<CardFooter>
				<CardLink href="/login" label="Back to login" />
				<CardLink href="/privacy" label="Privacy" className="!ml-auto" />
				<CardLink href="/terms" label="Terms" />
			</CardFooter>
		</Card>
	)
}
