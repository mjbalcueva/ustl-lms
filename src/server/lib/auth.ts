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
						create: {
							name: user.name
						}
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
			const { sub, role, isTwoFactorEnabled, name, email, hasPassword } = token
			if (sub) session.user.id = sub
			if (role) session.user.role = role

			session.user.name = name
			session.user.email = email!
			session.user.hasPassword = hasPassword!
			session.user.isTwoFactorEnabled = isTwoFactorEnabled

			return session
		},
		async jwt({ token }) {
			if (!token.sub) return token

			const existingUser = await getUserByIdWithAccountsAndProfile(token.sub)
			if (!existingUser) return token

			const { profile, email, role, isTwoFactorEnabled, password } = existingUser
			token.name = profile?.name
			token.email = email
			token.role = role
			token.hasPassword = !!password
			token.isTwoFactorEnabled = isTwoFactorEnabled

			return token
		}
	},
	adapter: AuthAdapter(db),
	session: { strategy: 'jwt' },
	...authConfig
})
