import { type Metadata } from 'next'

import {
	AuthCard,
	AuthCardContent,
	AuthCardFooter,
	AuthCardHeader,
	AuthCardLink
} from '@/client/components/auth/auth-card'
import { VerifyEmailForm } from '@/client/components/auth/forms/verify-email'

export const metadata: Metadata = {
	title: 'Verify Your Email | Account Activation',
	description:
		'Complete your account setup by verifying your email address. This quick step ensures the security of your account and enables full access to our services.'
}

export default function Page({ searchParams }: { searchParams: { token: string } }) {
	return (
		<AuthCard>
			<AuthCardHeader title="Confirming your verification" description="We just want to make sure it's really you." />
			<AuthCardContent>
				<VerifyEmailForm token={searchParams.token} />
			</AuthCardContent>
			<AuthCardFooter>
				<AuthCardLink href="/auth/login" label="Back to login" />
				<AuthCardLink href="/privacy" label="Privacy" className="!ml-auto" />
				<AuthCardLink href="/terms" label="Terms" />
			</AuthCardFooter>
		</AuthCard>
	)
}
