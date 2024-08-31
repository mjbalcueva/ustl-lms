import { PrismaAdapter } from '@auth/prisma-adapter'
import { type UserRole } from '@prisma/client'
import NextAuth, { type DefaultSession } from 'next-auth'
import { type DefaultJWT } from 'next-auth/jwt'

import { getTwoFactorConfirmationByUserId } from '@/shared/data/two-factor-confirmation'
import { getUserById, getUserByIdWithAccounts } from '@/shared/data/user'

import authConfig from '@/server/lib/auth.config'
import { db } from '@/server/lib/db'

declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: {
			role: UserRole
			isTwoFactorEnabled: boolean
			isOAuth: boolean
		} & DefaultSession['user']
	}
}

declare module 'next-auth/jwt' {
	interface JWT extends DefaultJWT {
		role: UserRole
		isTwoFactorEnabled: boolean
		isOAuth: boolean
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
				data: { emailVerified: new Date() }
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
			const { sub, role, isTwoFactorEnabled, name, email, isOAuth } = token
			if (sub) session.user.id = sub
			if (role) session.user.role = role

			session.user.name = name
			session.user.email = email!
			session.user.isOAuth = isOAuth
			session.user.isTwoFactorEnabled = isTwoFactorEnabled

			return session
		},
		async jwt({ token }) {
			if (!token.sub) return token
			const existingUser = await getUserByIdWithAccounts(token.sub)
			if (!existingUser) return token

			const { accounts, name, email, role, isTwoFactorEnabled } = existingUser
			token.name = name
			token.email = email
			token.role = role
			token.isOAuth = !!accounts.length
			token.isTwoFactorEnabled = isTwoFactorEnabled

			return token
		}
	},
	adapter: PrismaAdapter(db),
	session: { strategy: 'jwt' },
	...authConfig
})
