import {
	AuthCard,
	AuthCardContent,
	AuthCardFooter,
	AuthCardHeader,
	AuthCardLink
} from '@/client/components/auth/auth-card'
import { ForgotPasswordForm } from '@/client/components/auth/forms/forgot-password'

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
