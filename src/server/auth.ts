import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

import { db } from '@/server/db'

import { env } from '@/env'

export const {
	handlers: { GET, POST },
	auth
} = NextAuth({
	adapter: PrismaAdapter(db),
	session: { strategy: 'jwt' },
	pages: {
		signIn: '/auth/login'
	},
	events: {
		async linkAccount({ user }) {
			await db.user.update({
				where: { id: user.id },
				data: { emailVerified: new Date() }
			})
		}
	},
	callbacks: {
		session: ({ session, user }) => {
			return {
				...session,
				user: {
					...session.user,
					id: user.id
				}
			}
		}
	},
	providers: [
		Google({
			clientId: env.AUTH_GOOGLE_ID,
			clientSecret: env.AUTH_GOOGLE_SECRET,
			allowDangerousEmailAccountLinking: true
		})
	]
})
