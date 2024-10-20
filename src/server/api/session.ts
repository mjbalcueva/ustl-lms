import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export const sessionRouter = createTRPCRouter({
	getSession: publicProcedure.query(async ({ ctx }) => {
		return ctx.session ?? null
	})
})
