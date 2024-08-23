import { Resend } from 'resend'

import PasswordResetEmail from '@/client/emails/password-reset-email'
import TwoFactorTokenEmail from '@/client/emails/two-factor-token-email'
import VerificationEmail from '@/client/emails/verification-email'

import { env } from '@/env'

const resend = new Resend(env.RESEND_API_KEY)

const domain = env.AUTH_URL
const supportMail = 'support@ustl-lms.tech'

export async function sendPasswordResetEmail(email: string, token: string) {
	const resetLink = `${domain}/auth/new-password?token=${token}`

	await resend.emails.send({
		from: `Scholar <${supportMail}>`,
		to: email,
		subject: 'Reset your password',
		react: PasswordResetEmail({ email, resetLink })
	})
}

export async function sendTwoFactorTokenEmail(email: string, token: string) {
	await resend.emails.send({
		from: `Scholar <${supportMail}>`,
		to: email,
		subject: 'Two Factor Authentication Code',
		react: TwoFactorTokenEmail({ email, token })
	})
}

export async function sendVerificationEmail(email: string, token: string) {
	const confirmLink = `${domain}/auth/new-verification?token=${token}`

	await resend.emails.send({
		from: `Scholar <${supportMail}>`,
		to: email,
		subject: 'Confirm your email',
		react: VerificationEmail({ email, confirmLink })
	})
}
