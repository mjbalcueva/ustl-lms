import bcrypt from 'bcryptjs'
import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

import { getUserByEmail } from '@/shared/data/user'
import { loginSchema } from '@/shared/schemas'

import { env } from '@/env'

export default {
	providers: [
		Google({
			clientId: env.AUTH_GOOGLE_ID,
			clientSecret: env.AUTH_GOOGLE_SECRET,
			allowDangerousEmailAccountLinking: true
		}),
		Credentials({
			async authorize(credentials) {
				const validatedFields = loginSchema.safeParse(credentials)
				if (!validatedFields.success) return null

				const { email, password } = validatedFields.data

				const user = await getUserByEmail(email)
				if (!user?.password) return null

				const isPasswordValid = await bcrypt.compare(password, user.password)
				if (!isPasswordValid) return null

				console.log('user', user)
				return user
			}
		})
	]
} satisfies NextAuthConfig