import { type UserRole } from '@prisma/client'
import NextAuth, { type DefaultSession } from 'next-auth'
import { type DefaultJWT } from 'next-auth/jwt'

import { getTwoFactorConfirmationByUserId } from '@/shared/data/two-factor-confirmation'
import { getUserById, getUserByIdWithAccountsAndProfile } from '@/shared/data/user'

import { AuthAdapter } from '@/server/lib/auth-adapter'
import authConfig from '@/server/lib/auth.config'
import { db } from '@/server/lib/db'

declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: {
			role: UserRole
			isTwoFactorEnabled: boolean
			hasPassword: boolean
		} & DefaultSession['user']
	}
}

declare module 'next-auth/jwt' {
	interface JWT extends DefaultJWT {
		role: UserRole
		isTwoFactorEnabled: boolean
		hasPassword: boolean
	}
}

export const {
	auth,
	handlers: { GET, POST },
	signIn,
	signOut
} = NextAuth({
	pages: {
		signIn: '/auth/login',
		error: '/auth/error'
	},

	events: {
		async linkAccount({ user }) {
			await db.user.update({
				where: { id: user.id },
				data: {
					emailVerified: new Date(),
					profile: {
						create: { name: user.name }
					}
				}
			})
		}
	},

	callbacks: {
		async signIn({ account, profile, user }) {
			if (account?.provider !== 'credentials') return profile?.email?.endsWith('@ust-legazpi.edu.ph') ?? false

			if (!user.id) return false

			const existingUser = await getUserById(user.id)
			if (!existingUser) return false

			if (!existingUser.emailVerified) return false

			if (!existingUser.isTwoFactorEnabled) return true
			const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

			if (!twoFactorConfirmation) return false

			await db.twoFactorConfirmation.delete({
				where: { userId: existingUser.id }
			})

			return true
		},

		async session({ token, session }) {
			const { sub: id, name, email, role, hasPassword, isTwoFactorEnabled } = token

			return {
				...session,
				user: { id, name, email, role, hasPassword, isTwoFactorEnabled }
			}
		},

		async jwt({ token }) {
			if (!token.sub) return token

			const existingUser = await getUserByIdWithAccountsAndProfile(token.sub)
			if (!existingUser) return token

			const { role, password, isTwoFactorEnabled } = existingUser

			return {
				...token,
				role,
				hasPassword: !!password,
				isTwoFactorEnabled
			}
		}
	},

	adapter: AuthAdapter(db),

	session: { strategy: 'jwt' },

	...authConfig
})
