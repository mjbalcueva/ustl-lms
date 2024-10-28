import { type Adapter, type AdapterAccount, type AdapterUser } from '@auth/core/adapters'
import { type PrismaClient } from '@prisma/client'

export function adapter(db: PrismaClient): Adapter {
	return {
		// Create a new user with profile info
		createUser: async (user) => {
			const createdUser = await db.user.create({
				data: {
					email: user.email,
					emailVerified: user.emailVerified,
					profile: {
						create: { name: user.name, imageUrl: user.image }
					}
				},
				include: { profile: true }
			})

			return {
				id: createdUser.id,
				name: createdUser.profile?.name,
				email: createdUser.email,
				emailVerified: createdUser.emailVerified,
				imageUrl: createdUser.profile?.imageUrl
			} as AdapterUser
		},

		// Find a user by their unique ID
		getUser: async (id) => {
			const user = await db.user.findUnique({ where: { id } })
			return user as AdapterUser
		},

		// Find a user by their email address
		getUserByEmail: async (email) => {
			const user = await db.user.findUnique({ where: { email } })
			return user as AdapterUser
		},

		// Get a user by account provider details
		getUserByAccount: async ({ provider, providerAccountId }) => {
			const account = await db.account.findUnique({
				where: { provider_providerAccountId: { provider, providerAccountId } },
				select: { user: true }
			})
			return account?.user as AdapterUser
		},

		// Update a user's information
		updateUser: async (user) => {
			const updatedUser = await db.user.update({
				where: { id: user.id },
				data: user
			})
			return updatedUser as AdapterUser
		},

		// Delete a user by their unique ID
		deleteUser: async (id) => {
			const deletedUser = await db.user.delete({ where: { id } })
			return deletedUser as AdapterUser
		},

		// Link a new account to a user
		linkAccount: async (account) => {
			const linkedAccount = await db.account.create({ data: account })
			return linkedAccount as AdapterAccount
		},

		// Unlink an account from a user
		unlinkAccount: async ({ provider, providerAccountId }) => {
			const unlinkedAccount = await db.account.delete({
				where: { provider_providerAccountId: { provider, providerAccountId } }
			})
			return unlinkedAccount as AdapterAccount
		},

		// Retrieve account details
		getAccount: async (providerAccountId, provider) => {
			const account = await db.account.findFirst({
				where: { providerAccountId, provider }
			})
			return account as AdapterAccount
		}
	}
}
