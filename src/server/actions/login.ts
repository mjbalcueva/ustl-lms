'use server'

import { AuthError } from 'next-auth'

// import { getTwoFactorConfirmationByUserId } from '@/shared/data/two-factor-confirmation'
// import { getTwoFactorTokenByEmail } from '@/shared/data/two-factor-token'
import { getUserByEmail } from '@/shared/data/user'
import { loginSchema, type LoginSchema } from '@/shared/schemas'

import { signIn } from '@/server/auth'

// import { db } from '@/server/db'

import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

export const login = async (values: LoginSchema) => {
	const validatedFields = loginSchema.safeParse(values)
	if (!validatedFields.success) return { error: 'Invalid Fields' }

	const { email, password } = validatedFields.data

	const existingUser = await getUserByEmail(email)

	// Check if the user exists
	if (!existingUser) return { error: 'User does not exist!' }

	// Check if the user's email exists
	if (!existingUser.email) return { error: 'Email does not exist!' }

	// Check if the user has a password (not a Google sign-in user)
	if (!existingUser.password) return { error: 'Sign in with Google instead!' }

	// Check if the user's email is verified
	// if (!existingUser.emailVerified) {
	// 	// TODO: send verification token email
	// 	return { message: 'Confirmation email sent!' }
	// }

	// Check if the user has 2FA enabled
	// if (existingUser.isTwoFactorEnabled) {
	// 	if (code) {
	// 		const twoFactorToken = await getTwoFactorTokenByEmail(email)
	// 		if (!twoFactorToken) return { error: 'Invalid 2FA code!' }
	// 		if (twoFactorToken.token !== code) return { error: 'Invalid 2FA code!' }

	// 		const hasExpired = new Date(twoFactorToken.expires) < new Date()
	// 		if (hasExpired) return { error: '2FA code has expired!' }

	// 		await db.twoFactorToken.delete({
	// 			where: {
	// 				id: twoFactorToken.id
	// 			}
	// 		})

	// 		const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)
	// 		if (!existingConfirmation) return { error: '2FA confirmation not found!' }

	// 		await db.twoFactorConfirmation.delete({
	// 			where: {
	// 				id: existingConfirmation.id
	// 			}
	// 		})

	// 		await db.twoFactorConfirmation.create({
	// 			data: {
	// 				userId: existingUser.id
	// 			}
	// 		})
	// 	} else {
	// 		// const twoFactorToken = await generateTwoFactorToken(existingUser.email)
	// 		// TODO: send 2FA code email
	// 		return { twoFactor: true }
	// 	}

	// 	return { message: '2FA code sent!' }
	// }

	try {
		await signIn('credentials', {
			email,
			password,
			redirectTo: DEFAULT_LOGIN_REDIRECT
		})
		return { success: 'Success' }
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
					return { error: 'Invalid Credentials' }
				default:
					return { error: error.message }
			}
		}
		throw error
	}
}
