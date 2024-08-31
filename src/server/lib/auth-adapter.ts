import { type Adapter, type AdapterAccount, type AdapterUser } from '@auth/core/adapters'
import { type PrismaClient } from '@prisma/client'

export function AuthAdapter(prisma: PrismaClient): Adapter {
	return {
		createUser: async (user) => {
			const { id, ...userData } = await prisma.user.create({
				data: {
					email: user.email,
					emailVerified: user.emailVerified,
					profile: { create: { name: user.name, image: user.image } }
				},
				include: { profile: true }
			})
			return {
				id,
				name: userData.profile?.name,
				email: userData.email!,
				emailVerified: userData.emailVerified,
				image: userData.profile?.image
			}
		},
		getUser: (id) => prisma.user.findUnique({ where: { id } }) as Promise<AdapterUser>,
		getUserByEmail: (email) => prisma.user.findUnique({ where: { email } }) as Promise<AdapterUser>,
		getUserByAccount: async (provider_providerAccountId) => {
			const account = await prisma.account.findUnique({
				where: { provider_providerAccountId },
				select: { user: true }
			})
			return account?.user as AdapterUser
		},
		updateUser: ({ id, ...data }) => prisma.user.update({ where: { id }, data }) as Promise<AdapterUser>,
		deleteUser: (id) => prisma.user.delete({ where: { id } }) as Promise<AdapterUser>,
		linkAccount: (data) => prisma.account.create({ data }) as unknown as AdapterAccount,
		unlinkAccount: (provider_providerAccountId) =>
			prisma.account.delete({ where: { provider_providerAccountId } }) as unknown as AdapterAccount,
		getAccount: (providerAccountId, provider) =>
			prisma.account.findFirst({ where: { providerAccountId, provider } }) as Promise<AdapterAccount | null>
	}
}
