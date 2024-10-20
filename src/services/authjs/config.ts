import { compare } from 'bcryptjs'
import { type NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

import { getUserByEmail } from '@/server/data/users'

import { env } from '@/core/env/server'

import { loginSchema } from '@/features/auth/validations/login-schema'

export const config: NextAuthConfig = {
	providers: [
		Google({
			clientId: env.AUTH_GOOGLE_ID,
			clientSecret: env.AUTH_GOOGLE_SECRET,
			allowDangerousEmailAccountLinking: true,
			authorization: {
				params: {
					prompt: 'select_account'
				}
			}
		}),
		Credentials({
			async authorize(credentials) {
				const validatedFields = loginSchema.safeParse(credentials)
				if (!validatedFields.success) return null

				const { email, password } = validatedFields.data

				const user = await getUserByEmail(email)
				if (user instanceof Error || !user?.password) return null

				const isPasswordValid = await compare(password, user.password)
				if (!isPasswordValid) return null

				return user
			}
		})
	]
}
