import { createCourseSchema } from '@/shared/validations/course'

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

export const courseRouter = createTRPCRouter({
	createCourse: protectedProcedure.input(createCourseSchema).mutation(async ({ ctx, input }) => {
		const { title } = input

		await ctx.db.course.create({
			data: {
				title,
				userId: ctx.session.user.id!
			}
		})

		return { message: 'Course created!' }
	})
})
