import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

export const instructorRouter = createTRPCRouter({
	getCourses: instructorProcedure.query(async ({ ctx }) => {
		const courses = await ctx.db.course.findMany({
			where: { instructorId: ctx.session.user.id! }
		})

		return courses
	})
})
