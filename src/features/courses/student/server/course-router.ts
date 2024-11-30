import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

export const courseRouter = createTRPCRouter({
	// ---------------------------------------------------------------------------
	// READ
	// ---------------------------------------------------------------------------
	//

	// Find Many Enrolled Courses
	findManyEnrolledCourses: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session.user.id

		const courses = await ctx.db.course.findMany({
			where: {
				enrollments: { some: { studentId: userId } }
			},
			include: {
				tags: { orderBy: { name: 'asc' } },
				instructor: { select: { profile: { select: { name: true } } } }
			}
		})

		return { courses }
	})
})
