import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

export const studentRouter = createTRPCRouter({
	sample: protectedProcedure.query(() => {
		return 'Hello World'
	})
})
