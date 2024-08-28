import { hash } from 'bcryptjs'

import { getUserByEmail } from '@/shared/data/user'
import { registerSchema } from '@/shared/validations/register'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { sendVerificationEmail } from '@/server/lib/mail'
import { generateVerificationToken } from '@/server/lib/tokens'

export const userRouter = createTRPCRouter({
	register: publicProcedure.input(registerSchema).mutation(async ({ ctx, input }) => {
		const { name, email, password } = input

		if (!email.endsWith('@ust-legazpi.edu.ph')) throw new Error('Please use your UST Legazpi email address!')
		const existingUser = await getUserByEmail(email)

		if (existingUser) throw new Error('User already exists!')
		const hashedPassword = await hash(password, 10)

		await ctx.db.user.create({
			data: {
				name,
				email,
				password: hashedPassword
			}
		})

		const verificationToken = await generateVerificationToken(email)
		await sendVerificationEmail(verificationToken.email, verificationToken.token)

		return { message: 'Confirmation email sent.' }
	})
})
