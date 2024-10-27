import { type Metadata } from 'next'

import { VerifyEmailForm } from '@/features/auth/components/forms/verify-email-form'
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
	title: 'Verify Your Email | Account Activation',
	description:
		'Complete your account setup by verifying your email address. This quick step ensures the security of your account and enables full access to our services.'
}

export default function Page({ searchParams }: { searchParams: { token: string } }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Confirming your verification</CardTitle>
				<CardDescription>We just want to make sure it&apos;s really you.</CardDescription>
			</CardHeader>
			<CardContent>
				<VerifyEmailForm token={searchParams.token} />
			</CardContent>
			<CardFooter>
				<CardLink href="/login" label="Back to login" />
				<CardLink href="/privacy" label="Privacy" className="!ml-auto" />
				<CardLink href="/terms" label="Terms" />
			</CardFooter>
		</Card>
	)
}
