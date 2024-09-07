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
		async linkAccount({ user, profile }) {
			if (!user.id) return
			const existingUser = await getUserByIdWithAccountsAndProfile(user.id)

			await db.user.update({
				where: { id: user.id },
				data: {
					emailVerified: new Date(),
					profile: {
						update: {
							image: existingUser?.profile?.image ? null : profile.image
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
			return {
				...session,
				user: {
					id: token.sub,
					name: token.name,
					image: token.image as string,
					email: token.email,
					role: token.role,
					hasPassword: token.hasPassword,
					isTwoFactorEnabled: token.isTwoFactorEnabled
				}
			}
		},

		async jwt({ token }) {
			if (!token.sub) return token

			const existingUser = await getUserByIdWithAccountsAndProfile(token.sub)
			if (!existingUser) return token

			token.name = existingUser.profile?.name
			token.image = existingUser.profile?.image
			token.role = existingUser.role
			token.hasPassword = !!existingUser.password
			token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled

			return token
		}
	},

	adapter: AuthAdapter(db),

	session: { strategy: 'jwt' },

	...authConfig
})
