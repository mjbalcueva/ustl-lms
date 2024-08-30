import {
	AuthCard,
	AuthCardContent,
	AuthCardFooter,
	AuthCardHeader,
	AuthCardLink
} from '@/client/components/auth/auth-card'
import { ResetPasswordForm } from '@/client/components/auth/forms/reset-password'

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
