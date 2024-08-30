import { type Metadata } from 'next'

import {
	AuthCard,
	AuthCardContent,
	AuthCardFooter,
	AuthCardHeader,
	AuthCardLink
} from '@/client/components/auth/auth-card'
import { ForgotPasswordForm } from '@/client/components/auth/forms/forgot-password'

export const metadata: Metadata = {
	title: 'Forgot Password | Account Recovery',
	description:
		'Securely reset your password. Enter your email address to receive instructions on how to regain access to your account.'
}

export default function Page() {
	return (
		<AuthCard>
			<AuthCardHeader title="Forgot your password?" description="Enter your email address to reset your password." />
			<AuthCardContent>
				<ForgotPasswordForm />
			</AuthCardContent>
			<AuthCardFooter>
				<AuthCardLink href="/auth/login" label="Back to login" />
				<AuthCardLink href="/privacy" label="Privacy" className="!ml-auto" />
				<AuthCardLink href="/terms" label="Terms" />
			</AuthCardFooter>
		</AuthCard>
	)
}
