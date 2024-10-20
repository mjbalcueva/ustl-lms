import { TRPCError } from '@trpc/server'
import { compare, hash } from 'bcryptjs'

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

import { addPasswordSchema } from '@/features/account/validations/add-password-schema'
import { editNameSchema } from '@/features/account/validations/edit-name-schema'
import { editPasswordSchema } from '@/features/account/validations/edit-password-schema'
import { editTwoFactorSchema } from '@/features/account/validations/edit-two-factor-schema'

export const accountRouter = createTRPCRouter({
	addPassword: protectedProcedure.input(addPasswordSchema).mutation(async ({ ctx, input }) => {
		const { password } = input

		const existingUser = await ctx.db.user.findUnique({
			where: { id: ctx.session.user.id },
			select: { password: true }
		})

		if (existingUser?.password) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'You already have a password. Refresh the page to see changes.'
			})
		}

		const hashedPassword = await hash(password, 10)

		await ctx.db.user.update({
			where: { id: ctx.session.user.id },
			data: { password: hashedPassword }
		})

		return { message: 'Password added successfully!' }
	}),

	editName: protectedProcedure.input(editNameSchema).mutation(async ({ ctx, input }) => {
		const { name } = input

		await ctx.db.user.update({
			where: { id: ctx.session.user.id },
			data: { profile: { update: { name } } }
		})

		return { message: 'Name updated!' }
	}),

	editTwoFactor: protectedProcedure.input(editTwoFactorSchema).mutation(async ({ ctx, input }) => {
		const { twoFactorEnabled } = input

		await ctx.db.user.update({
			where: { id: ctx.session.user.id },
			data: { isTwoFactorEnabled: twoFactorEnabled }
		})

		return { message: 'Two-factor authentication updated!' }
	}),

	editPassword: protectedProcedure.input(editPasswordSchema).mutation(async ({ ctx, input }) => {
		const { currentPassword, newPassword } = input

		const existingUser = await ctx.db.user.findUnique({ where: { id: ctx.session.user.id } })
		if (!existingUser) {
			throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found.' })
		}

		if (!existingUser.password) {
			throw new TRPCError({ code: 'BAD_REQUEST', message: 'User does not have a password set.' })
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

		return { message: 'Password updated successfully!' }
	})
})
