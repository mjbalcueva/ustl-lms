import { type Metadata } from 'next'

import {
	AuthCard,
	AuthCardContent,
	AuthCardFooter,
	AuthCardHeader,
	AuthCardLink
} from '@/client/components/auth/auth-card'
import { ResetPasswordForm } from '@/client/components/auth/forms/reset-password'

export const metadata: Metadata = {
	title: 'Reset Your Password | Secure Account Recovery',
	description:
		'Create a new, secure password for your account. Follow our guided process to reset your password and regain access to your account safely.'
}

export default function Page({ params }: { params: { token: string } }) {
	return (
		<AuthCard>
			<AuthCardHeader title="Reset your password" description="Enter a new password for your account." />
			<AuthCardContent>
				<ResetPasswordForm token={params.token} />
			</AuthCardContent>
			<AuthCardFooter>
				<AuthCardLink href="/auth/login" label="Back to login" />
				<AuthCardLink href="/privacy" label="Privacy" className="!ml-auto" />
				<AuthCardLink href="/terms" label="Terms" />
			</AuthCardFooter>
		</AuthCard>
	)
}
