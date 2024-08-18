import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'

import { getUserByIdWithAccounts } from '@/shared/data/user'

import authConfig from '@/server/auth.config'
import { db } from '@/server/db'

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
		async signIn({ account, profile }) {
			if (account?.provider !== 'credentials') return profile?.email?.endsWith('@ust-legazpi.edu.ph') ?? false

			return true
		},
		// async signIn({ user, account }) {
		// 	// Allow OAuth without email verification, can be account?.type too
		// 	if (account?.provider !== 'credentials') return true

		// 	if (!user.id) {
		// 		return false
		// 	}

		// 	const existingUser = await getUserById(user.id)

		// 	// Prevent sign in without email verification
		// 	if (!existingUser?.emailVerified) {
		// 		return false
		// 	}

		// 	if (existingUser.isTwoFactorEnabled) {
		// 		const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

		// 		// If not have a confirmation, block login
		// 		if (!twoFactorConfirmation) return false

		// 		// Delete two factor confirmation for next sign in
		// 		await db.twoFactorConfirmation.delete({
		// 			where: { userId: existingUser.id }
		// 		})
		// 	}

		// 	return true
		// },
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
