import { TRPCClientError } from '@trpc/client'

import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

import { generateCourseInviteToken } from '@/features/courses/shared/lib/generate-course-invite-token'
import {
	addCourseSchema,
	findOneCourseSchema
} from '@/features/courses/shared/validations/course-schema'

export const courseRouter = createTRPCRouter({
	// CREATE
	//
	addCourse: instructorProcedure
		.input(addCourseSchema)
		.mutation(async ({ ctx, input }) => {
			const { code, title } = input
			const token = generateCourseInviteToken()

			const course = await ctx.db.course.create({
				data: {
					code,
					title,
					token,
					instructorId: ctx.session.user.id
				}
			})

			return { message: 'Course created!', course }
		}),

	// READ
	//
	findOneCourse: instructorProcedure
		.input(findOneCourseSchema)
		.query(async ({ ctx, input }) => {
			const { courseId } = input
			const instructorId = ctx.session.user.id

			const course = await ctx.db.course.findUnique({
				where: { courseId, instructorId },
				include: { attachments: { orderBy: { createdAt: 'desc' } } }
			})

			if (!course) throw new TRPCClientError('Course not found')

			return { course }
		}),

	findManyCourses: instructorProcedure.query(async ({ ctx }) => {
		const instructorId = ctx.session.user.id

		const courses = await ctx.db.course.findMany({
			where: { instructorId },
			include: {
				_count: {
					select: { enrollments: true, chapters: true }
				},
				chapters: {
					include: { chapterProgress: true }
				},
				enrollments: true
			}
		})

		const count = {
			total: courses.length,
			draft: courses.filter((c) => c.status === 'DRAFT').length,
			published: courses.filter((c) => c.status === 'PUBLISHED').length,
			archived: courses.filter((c) => c.status === 'ARCHIVED').length
		}

		const stats = {
			students: courses.reduce(
				(acc, c) => acc + (c._count?.enrollments ?? 0),
				0
			),
			chapters: courses.reduce((acc, c) => acc + (c._count?.chapters ?? 0), 0),
			completionRate: courses
				.flatMap((c) =>
					c.chapters.length
						? c.enrollments.map(
								(e) =>
									(c.chapters.filter((ch) =>
										ch.chapterProgress.some(
											(p) => p.studentId === e.studentId && p.isCompleted
										)
									).length /
										c.chapters.length) *
									100
							)
						: []
				)
				.reduce((acc, r, _, arr) => (arr.length ? acc + r / arr.length : 0), 0)
		}

		return { courses, count, stats }
	})
})
