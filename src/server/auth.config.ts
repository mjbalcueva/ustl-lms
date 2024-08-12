import bcrypt from 'bcrypt'
import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

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
				return null
			}
		})
	]
} satisfies NextAuthConfig
