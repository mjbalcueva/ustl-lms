'use server'

import { AuthError } from 'next-auth'

import { getUserByEmail } from '@/shared/data/user'
import { loginSchema, type LoginSchema } from '@/shared/schemas'

import { signIn } from '@/server/auth'

import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

export const login = async (values: LoginSchema) => {
	const validatedFields = loginSchema.safeParse(values)

	if (!validatedFields.success) return { error: 'Invalid Fields' }
	const { email, password } = validatedFields.data

	if (!email.endsWith('@ust-legazpi.edu.ph')) return { error: 'Please use your UST Legazpi email address.' }
	const existingUser = await getUserByEmail(email)
	if (!existingUser) return { error: 'User does not exist!' }

	if (!existingUser.password) return { error: 'Sign in with Google instead!' }

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