import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'

import authConfig from '@/server/auth.config'
import { db } from '@/server/db'

export const {
	handlers: { GET, POST },
	auth
} = NextAuth({
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
	adapter: PrismaAdapter(db),
	session: { strategy: 'jwt' },
	...authConfig
})
