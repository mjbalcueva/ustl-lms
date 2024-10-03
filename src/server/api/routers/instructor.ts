import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

export const instructorRouter = createTRPCRouter({
	getCourses: instructorProcedure.query(async ({ ctx }) => {
		const courses = await ctx.db.course.findMany({
			where: { createdById: ctx.session.user.id! }
		})

		return courses
	}),

	getCourseStats: instructorProcedure.query(async ({ ctx }) => {
		const courses = await ctx.db.course.findMany({
			where: { createdById: ctx.session.user.id! }
		})

		const totalCourses = courses.length
		const publishedCourses = courses.filter((course) => course.status === 'PUBLISHED').length
		const drafts = courses.filter((course) => course.status === 'DRAFT').length

		return { totalCourses, publishedCourses, drafts }
	})
})
