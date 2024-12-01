'use server'

import { compare } from 'bcryptjs'
import { AuthError } from 'next-auth'

import { getTwoFactorConfirmationByUserId } from '@/server/data/two-factor-confirmation'
import { getTwoFactorTokenByEmail } from '@/server/data/two-factor-token'
import { getUserByEmail } from '@/server/data/users'
import { db } from '@/server/db'

import { signIn } from '@/services/authjs/auth'

import { DEFAULT_REDIRECT } from '@/core/routes/constants'

import {
	sendTwoFactorTokenEmail,
	sendVerificationEmail
} from '@/features/auth/lib/mail'
import {
	generateTwoFactorToken,
	generateVerificationToken
} from '@/features/auth/lib/tokens'
import {
	loginSchema,
	type LoginSchema
} from '@/features/auth/validations/login-schema'

export const login = async (values: LoginSchema) => {
	const validatedFields = loginSchema.safeParse(values)

	if (!validatedFields.success) return { error: 'Invalid Fields' }
	const { code, email, password } = validatedFields.data

	if (!email.endsWith('@ust-legazpi.edu.ph'))
		return { error: 'Please use your UST Legazpi email address.' }

	const existingUser = await getUserByEmail(email)

	if (!existingUser || existingUser instanceof Error || !existingUser.email)
		return { error: 'User does not exist!' }

	if (!existingUser.password) return { error: 'Sign in with Google instead!' }

	if (!existingUser.emailVerified) {
		const verificationToken = await generateVerificationToken(
			existingUser.email
		)
		await sendVerificationEmail(
			verificationToken.email,
			verificationToken.token
		)

		return { success: 'Confirmation email sent!' }
	}

	if (existingUser.isTwoFactorEnabled) {
		if (!code) {
			const isPasswordValid = await compare(password, existingUser.password)
			if (!isPasswordValid) return { error: 'Invalid credentials' }

			const twoFactorToken = await generateTwoFactorToken(existingUser.email)
			await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token)

			return { success: '2FA email sent!', twoFactor: true }
		}

		const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)
		if (
			!twoFactorToken ||
			twoFactorToken instanceof Error ||
			twoFactorToken.token !== code
		)
			return { error: 'Invalid 2FA code!' }

		const hasExpired = new Date(twoFactorToken.expires) < new Date()
		if (hasExpired) return { error: '2FA code has expired!' }

		await db.twoFactorToken.delete({
			where: { id: twoFactorToken.id }
		})

		const existingConfirmation = await getTwoFactorConfirmationByUserId(
			existingUser.id
		)

		if (!(existingConfirmation instanceof Error) && existingConfirmation) {
			await db.twoFactorConfirmation.delete({
				where: { id: existingConfirmation.id }
			})
		}

		await db.twoFactorConfirmation.create({
			data: { userId: existingUser.id }
		})
	}

	try {
		await signIn('credentials', {
			email,
			password,
			redirectTo: DEFAULT_REDIRECT
		})
		return { success: 'Success' }
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
					return { error: 'Invalid credentials' }
				case 'AccessDenied':
					return { error: 'Access Denied!' }
				default:
					return { error: error.message }
			}
		}
		throw error
	}
}
