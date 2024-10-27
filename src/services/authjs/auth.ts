import { type Role } from '@prisma/client'
import NextAuth, { type DefaultSession } from 'next-auth'
import { type DefaultJWT } from 'next-auth/jwt'

import { getTwoFactorConfirmationByUserId } from '@/server/data/two-factor-confirmation'
import { getUserById, getUserByIdWithAccountsAndProfile } from '@/server/data/users'
import { db } from '@/server/db'

import { adapter } from '@/services/authjs/adapter'
import { config } from '@/services/authjs/config'

declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: {
			role: Role
			isTwoFactorEnabled: boolean
			hasPassword: boolean
		} & DefaultSession['user']
	}
}

declare module 'next-auth/jwt' {
	interface JWT extends DefaultJWT {
		role: Role
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
		signIn: '/login',
		error: '/error'
	},

	events: {
		async linkAccount({ user, profile }) {
			const existingUser = await getUserByIdWithAccountsAndProfile(user.id ?? '')
			if (existingUser && !(existingUser instanceof Error))
				await db.user.update({
					where: { id: user.id },
					data: {
						emailVerified: new Date(),
						profile: {
							update: { image: existingUser.profile?.image ?? profile.image }
						}
					}
				})
		}
	},

	callbacks: {
		async signIn({ profile, user }) {
			if (profile?.email?.endsWith('@ust-legazpi.edu.ph')) return false

			const existingUser = await getUserById(user.id ?? '')
			if (!existingUser || existingUser instanceof Error) return false

			if (!existingUser.emailVerified) return false
			if (!existingUser.isTwoFactorEnabled) return true

			const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)
			if (!twoFactorConfirmation || twoFactorConfirmation instanceof Error) return false

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
			const existingUser = await getUserByIdWithAccountsAndProfile(token.sub ?? '')
			if (!existingUser || existingUser instanceof Error) return token

			token.name = existingUser.profile?.name
			token.image = existingUser.profile?.image
			token.role = existingUser.role
			token.hasPassword = !!existingUser.password
			token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled

			return token
		}
	},

	adapter: adapter(db),
	session: { strategy: 'jwt' },

	...config
})
