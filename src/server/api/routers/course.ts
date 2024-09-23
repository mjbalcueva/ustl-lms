import {
	createCourseSchema,
	editCourseCodeSchema,
	editCourseDescriptionSchema,
	editCourseImageSchema,
	editCourseTitleSchema,
	getCoursesSchema
} from '@/shared/validations/course'

import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'
import { utapi } from '@/server/lib/utapi'

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
			where: { id: courseId, createdById: ctx.session.user.id! },
			include: {
				attachment: { orderBy: { createdAt: 'desc' } },
				chapter: { orderBy: { position: 'asc' } }
			}
		})

		return { course }
	}),

	editCode: instructorProcedure.input(editCourseCodeSchema).mutation(async ({ ctx, input }) => {
		const { courseId, code } = input

		const { code: newCode } = await ctx.db.course.update({
			where: { id: courseId, createdById: ctx.session.user.id! },
			data: { code }
		})

		return { message: 'Course code updated!', newCode }
	}),

	editTitle: instructorProcedure.input(editCourseTitleSchema).mutation(async ({ ctx, input }) => {
		const { courseId, title } = input

		const { title: newTitle } = await ctx.db.course.update({
			where: { id: courseId, createdById: ctx.session.user.id! },
			data: { title }
		})

		return { message: 'Course title updated!', newTitle }
	}),

	editDescription: instructorProcedure.input(editCourseDescriptionSchema).mutation(async ({ ctx, input }) => {
		const { courseId, description } = input

		const { description: newDescription } = await ctx.db.course.update({
			where: { id: courseId, createdById: ctx.session.user.id! },
			data: { description }
		})

		return { message: 'Course description updated!', newDescription }
	}),

	editImage: instructorProcedure.input(editCourseImageSchema).mutation(async ({ ctx, input }) => {
		const { courseId, imageUrl } = input

		const course = await ctx.db.course.findUnique({
			where: { id: courseId, createdById: ctx.session.user.id! },
			select: { image: true }
		})

		const oldImageKey = course?.image?.split('/f/')[1]
		if (oldImageKey) await utapi.deleteFiles(oldImageKey)

		await ctx.db.course.update({
			where: { id: courseId, createdById: ctx.session.user.id! },
			data: { image: imageUrl }
		})

		return { message: 'Course image updated!' }
	})
})
