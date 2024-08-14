import { hash } from 'bcryptjs'

import { getUserByEmail } from '@/shared/data/user'
import { registerSchema } from '@/shared/schemas'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { db } from '@/server/db'

export const authRouter = createTRPCRouter({
	register: publicProcedure.input(registerSchema).mutation(async ({ input }) => {
		const hashedPassword = await hash(input.password, 10)
		const existingUser = await getUserByEmail(input.email)

		if (existingUser) throw new Error('User already exists!')

		await db.user.create({
			data: {
				name: input.name,
				email: input.email,
				password: hashedPassword
			}
		})

		return { message: 'User created successfully!' }
	})
})
