import { TRPCError } from '@trpc/server'
import { hash } from 'bcryptjs'
import { z } from 'zod'

import { registerSchema } from '@/shared/validations/register'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { sendVerificationEmail } from '@/server/lib/mail'
import { generateVerificationToken } from '@/server/lib/tokens'

export const userRouter = createTRPCRouter({
	register: publicProcedure.input(registerSchema).mutation(async ({ ctx, input }) => {
		const { name, email, password } = input

		if (!email.endsWith('@ust-legazpi.edu.ph')) {
			throw new TRPCError({ code: 'BAD_REQUEST', message: 'Please use your UST Legazpi email address.' })
		}

		const existingUser = await ctx.db.user.findUnique({ where: { email } })
		if (existingUser) {
			throw new TRPCError({ code: 'CONFLICT', message: 'User with this email already exists.' })
		}

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
	}),

	verifyEmail: publicProcedure.input(z.object({ token: z.string().nullable() })).mutation(async ({ ctx, input }) => {
		const { token } = input
		if (!token) {
			throw new TRPCError({ code: 'BAD_REQUEST', message: 'No verification token provided.' })
		}

		const existingToken = await ctx.db.verificationToken.findUnique({ where: { token } })
		if (!existingToken) {
			throw new TRPCError({ code: 'NOT_FOUND', message: 'Verification token not found.' })
		}

		const tokenHasExpired = new Date(existingToken.expires) < new Date()
		if (tokenHasExpired) {
			throw new TRPCError({ code: 'BAD_REQUEST', message: 'Verification token has expired.' })
		}

		const existingUser = await ctx.db.user.findUnique({ where: { email: existingToken.email } })
		if (!existingUser) {
			throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found.' })
		}

		await ctx.db.user.update({
			where: { id: existingUser.id },
			data: {
				emailVerified: new Date(),
				email: existingToken.email
			}
		})

		await ctx.db.verificationToken.delete({
			where: { id: existingToken.id }
		})

		return { message: 'Email verified!' }
	})
})
