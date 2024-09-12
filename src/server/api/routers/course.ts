import { createCourseSchema } from '@/shared/validations/course'

import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

export const courseRouter = createTRPCRouter({
	createCourse: instructorProcedure.input(createCourseSchema).mutation(async ({ ctx, input }) => {
		const { code, title } = input

		await ctx.db.course.create({
			data: {
				code,
				title,
				userId: ctx.session.user.id!
			}
		})

		return { message: 'Course created!' }
	})
})
