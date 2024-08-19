import { Resend } from 'resend'

import { env } from '@/env'

const resend = new Resend(env.RESEND_API_KEY)
const domain = env.AUTH_URL
const supportMail = 'support@ustl-lms.tech'

export async function sendVerificationEmail(email: string, token: string) {
	const confirmLink = `${domain}/auth/new-verification?token=${token}`

	await resend.emails.send({
		from: supportMail,
		to: email,
		subject: 'Confirm your email',
		html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
	})
}

export async function sendPasswordResetEmail(email: string, token: string) {
	const resetLink = `${domain}/auth/new-password?token=${token}`

	await resend.emails.send({
		from: supportMail,
		to: email,
		subject: 'Reset your password',
		html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
	})
}

export async function sendTwoFactorTokenEmail(email: string, token: string) {
	await resend.emails.send({
		from: supportMail,
		to: email,
		subject: '2FA Code',
		html: `<p>Your 2FA Code: ${token}</p>`
	})
}
