import { type Adapter, type AdapterAccount, type AdapterUser } from '@auth/core/adapters'
import { type PrismaClient } from '@prisma/client'

export function AuthAdapter(prisma: PrismaClient): Adapter {
	return {
		createUser: async (user) => {
			const { id, profile, ...userData } = await prisma.user.create({
				data: {
					email: user.email,
					emailVerified: user.emailVerified,
					profile: { create: { name: user.name, image: user.image } }
				},
				include: { profile: true }
			})

			if (!id) throw new Error('User creation failed')

			return {
				id,
				name: profile?.name,
				email: userData.email!,
				emailVerified: userData.emailVerified,
				image: profile?.image
			}
		},

		getUser: async (id) => prisma.user.findUnique({ where: { id } }) as Promise<AdapterUser>,

		getUserByEmail: async (email) => prisma.user.findUnique({ where: { email } }) as Promise<AdapterUser>,

		getUserByAccount: async (provider_providerAccountId) => {
			const account = await prisma.account.findUnique({
				where: { provider_providerAccountId },
				select: { user: true }
			})
			return account?.user as AdapterUser
		},

		updateUser: async ({ id, ...data }) => prisma.user.update({ where: { id }, data }) as Promise<AdapterUser>,

		linkAccount: (data) => prisma.account.create({ data }) as unknown as AdapterAccount,

		unlinkAccount: (provider_providerAccountId) =>
			prisma.account.delete({ where: { provider_providerAccountId } }) as unknown as AdapterAccount
	}
}
