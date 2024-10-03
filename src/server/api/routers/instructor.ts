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
		const publishedCourses = courses.filter((course) => course.isPublished).length
		const drafts = courses.filter((course) => !course.isPublished).length

		return { totalCourses, publishedCourses, drafts }
	})
})
