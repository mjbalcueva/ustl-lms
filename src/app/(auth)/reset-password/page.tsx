import { type Metadata } from 'next'

import { ResetPasswordForm } from '@/features/auth/components/forms/reset-password-form'
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
	title: 'Reset Your Password | Secure Account Recovery',
	description:
		'Create a new, secure password for your account. Follow our guided process to reset your password and regain access to your account safely.'
}

export default function Page({
	searchParams: { token }
}: {
	searchParams: { token: string }
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Reset your password: {token}</CardTitle>
				<CardDescription>
					Enter a new password for your account.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ResetPasswordForm token={token} />
			</CardContent>
			<CardFooter>
				<CardLink href="/login" label="Back to login" />
				<CardLink href="/privacy" label="Privacy" className="!ml-auto" />
				<CardLink href="/terms" label="Terms" />
			</CardFooter>
		</Card>
	)
}
