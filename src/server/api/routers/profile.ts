import { updateDisplayNameSchema } from '@/shared/validations/update-display-name'

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

export const profileRouter = createTRPCRouter({
	updateDisplayName: protectedProcedure.input(updateDisplayNameSchema).mutation(async ({ ctx, input }) => {
		const { name } = input

		await ctx.db.user.update({
			where: { id: ctx.session.user.id },
			data: { name }
		})

		return { message: 'Name updated!' }
	})
})
