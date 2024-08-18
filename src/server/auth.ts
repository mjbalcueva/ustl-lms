import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'

import { getUserById, getUserByIdWithAccounts } from '@/shared/data/user'

import authConfig from '@/server/auth.config'
import { db } from '@/server/lib/db'

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

			if (!existingUser?.emailVerified) return false

			// TODO: Add two factor confirmation check here

			return true
		},
		// 	if (existingUser.isTwoFactorEnabled) {
		// 		const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

		// 		// If not have a confirmation, block login
		// 		if (!twoFactorConfirmation) return false

		// 		// Delete two factor confirmation for next sign in
		// 		await db.twoFactorConfirmation.delete({
		// 			where: { userId: existingUser.id }
		// 		})
		// 	}
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
