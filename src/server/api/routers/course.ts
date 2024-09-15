import { createCourseSchema, getCoursesSchema, updateTitleSchema } from '@/shared/validations/course'

import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

export const courseRouter = createTRPCRouter({
	createCourse: instructorProcedure.input(createCourseSchema).mutation(async ({ ctx, input }) => {
		const { code, title } = input

		const course = await ctx.db.course.create({
			data: {
				code,
				title,
				createdById: ctx.session.user.id!
			}
		})

		return { message: 'Course created!', course }
	}),

	getCourse: instructorProcedure.input(getCoursesSchema).query(async ({ ctx, input }) => {
		const { courseId } = input

		const course = await ctx.db.course.findUnique({
			where: { id: courseId, createdById: ctx.session.user.id! }
		})

		return { course }
	}),

	updateTitle: instructorProcedure.input(updateTitleSchema).mutation(async ({ ctx, input }) => {
		const { courseId, title } = input

		const course = await ctx.db.course.update({
			where: { id: courseId, createdById: ctx.session.user.id! },
			data: { title }
		})

		return { message: 'Course title updated!', course }
	})
})
