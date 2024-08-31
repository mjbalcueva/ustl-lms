import { type Adapter, type AdapterUser } from '@auth/core/adapters'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { type PrismaClient } from '@prisma/client'

export function AuthAdapter(prisma: PrismaClient): Adapter {
	const adapter = PrismaAdapter(prisma)

	return {
		...adapter,
		createUser: async (user): Promise<AdapterUser> => {
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
		}
	}
}
