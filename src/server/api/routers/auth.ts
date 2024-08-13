import { hash } from 'bcryptjs'

import { getUserByEmail } from '@/shared/data/user'
import { loginSchema, registerSchema } from '@/shared/schemas'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { db } from '@/server/db'

export const authRouter = createTRPCRouter({
	login: publicProcedure.input(loginSchema).mutation(async ({ input }) => {
		const existingUser = await getUserByEmail(input.email)

		// Check if the user exists
		if (!existingUser) throw new Error('User does not exist!')

		// Check if the user's email exists
		if (!existingUser.email) throw new Error('Email does not exist!')

		// Check if the user has a password (not a Google sign-in user)
		if (!existingUser.password) throw new Error('Sign in with Google instead!')

		return input
	}),

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
