import { TRPCError } from '@trpc/server'
import { compare, hash } from 'bcryptjs'

import { forgotPasswordSchema } from '@/shared/validations/forgot-password'
import { registerSchema } from '@/shared/validations/register'
import { resetPasswordSchema } from '@/shared/validations/reset-password'
import { toggle2FASchema } from '@/shared/validations/toggle-2fa'
import { updatePasswordSchema } from '@/shared/validations/update-password'
import { verifyEmailSchema } from '@/shared/validations/verify-email'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc'
import { sendPasswordResetEmail, sendVerificationEmail } from '@/server/lib/mail'
import { generatePasswordResetToken, generateVerificationToken } from '@/server/lib/tokens'

export const authRouter = createTRPCRouter({
	updatePassword: protectedProcedure.input(updatePasswordSchema).mutation(async ({ ctx, input }) => {
		const { currentPassword, newPassword } = input
		const { user } = ctx.session

		const existingUser = await ctx.db.user.findUnique({ where: { id: user.id } })
		if (!existingUser) {
			throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found.' })
		}

		if (!existingUser.password) {
			// If user doesn't have a password, add the new password directly
			const hashedPassword = await hash(newPassword, 10)
			await ctx.db.user.update({
				where: { id: existingUser.id },
				data: { password: hashedPassword }
			})
			return { message: 'Password updated!' }
		}

		const isPasswordCorrect = await compare(currentPassword, existingUser.password)
		if (!isPasswordCorrect) {
			throw new TRPCError({ code: 'BAD_REQUEST', message: 'Incorrect current password.' })
		}

		const hashedPassword = await hash(newPassword, 10)
		await ctx.db.user.update({
			where: { id: existingUser.id },
			data: { password: hashedPassword }
		})

		return { message: 'Password updated!' }
	}),

	forgotPassword: publicProcedure.input(forgotPasswordSchema).mutation(async ({ ctx, input }) => {
		const { email } = input

		const existingUser = await ctx.db.user.findUnique({ where: { email } })
		if (!existingUser) {
			throw new TRPCError({ code: 'NOT_FOUND', message: 'User with this email not found.' })
		}

		const passwordResetToken = await generatePasswordResetToken(email)
		await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)

		return { message: 'Password reset email sent!' }
	}),

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

	resetPassword: publicProcedure.input(resetPasswordSchema).mutation(async ({ ctx, input }) => {
		const { password, token } = input
		if (!token) {
			throw new TRPCError({ code: 'BAD_REQUEST', message: 'No verification token provided.' })
		}

		const existingToken = await ctx.db.passwordResetToken.findUnique({ where: { token } })
		if (!existingToken) {
			throw new TRPCError({ code: 'NOT_FOUND', message: 'Verification token not found.' })
		}

		const tokenHasExpired = new Date(existingToken.expires) < new Date()
		if (tokenHasExpired) {
			throw new TRPCError({ code: 'BAD_REQUEST', message: 'Verification token has expired.' })
		}

		const existingUser = await ctx.db.user.findUnique({ where: { email: existingToken.email } })
		if (!existingUser) {
			throw new TRPCError({ code: 'NOT_FOUND', message: 'User with this email not found.' })
		}

		const hashedPassword = await hash(password, 10)

		await ctx.db.user.update({
			where: { id: existingUser.id },
			data: { password: hashedPassword }
		})

		await ctx.db.passwordResetToken.delete({
			where: { id: existingToken.id }
		})

		return { message: 'Password updated!' }
	}),

	toggle2FA: protectedProcedure.input(toggle2FASchema).mutation(async ({ ctx, input }) => {
		const { twoFactorEnabled } = input
		const { user } = ctx.session

		await ctx.db.user.update({
			where: { id: user.id },
			data: { isTwoFactorEnabled: twoFactorEnabled }
		})
	}),

	verifyEmail: publicProcedure.input(verifyEmailSchema).mutation(async ({ ctx, input }) => {
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
			throw new TRPCError({ code: 'NOT_FOUND', message: 'User with this email not found.' })
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
