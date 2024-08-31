import { type Adapter, type AdapterUser } from '@auth/core/adapters'
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

		getUserByAccount: async (provider_providerAccountId) => {
			const account = await prisma.account.findUnique({
				where: { provider_providerAccountId },
				select: { user: true }
			})
			return account?.user as AdapterUser
		}
	}
}
