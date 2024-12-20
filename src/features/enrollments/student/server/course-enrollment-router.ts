import { TRPCError } from '@trpc/server'

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

import {
	enrollToCourseSchema,
	findOneCourseSchema
} from '@/features/enrollments/shared/validations/course-enrollment-schema'

export const courseEnrollmentRouter = createTRPCRouter({
	// ---------------------------------------------------------------------------
	// CREATE
	// ---------------------------------------------------------------------------
	//

	// Enroll to Course
	enrollToCourse: protectedProcedure
		.input(enrollToCourseSchema)
		.mutation(async ({ ctx, input: { token } }) => {
			const userId = ctx.session.user.id

			if (!userId) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'You must be logged in to enroll in a course'
				})
			}

			const course = await ctx.db.course.findUnique({
				where: { token },
				include: {
					instructor: true,
					groupChats: {
						where: {
							OR: [{ type: 'FORUM' }, { type: 'TEXT' }]
						}
					}
				}
			})

			if (!course) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Invalid token'
				})
			}

			if (course.status !== 'PUBLISHED') {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'You can only enroll in published courses.'
				})
			}

			if (course.instructor.id === userId) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'You cannot enroll in your own course.'
				})
			}

			const existingEnrollment = await ctx.db.courseEnrollment.findFirst({
				where: {
					studentId: userId,
					courseId: course.courseId
				}
			})

			if (existingEnrollment) {
				throw new TRPCError({
					code: 'CONFLICT',
					message: 'You are already enrolled in this course.'
				})
			}

			// Create enrollment and add to group chats in a transaction
			await ctx.db.$transaction(async (tx) => {
				// Create the enrollment
				await tx.courseEnrollment.create({
					data: {
						studentId: userId,
						courseId: course.courseId
					}
				})

				// Add student to all course group chats
				await Promise.all(
					course.groupChats.map((chat) =>
						tx.groupChatMember.create({
							data: {
								userId,
								groupChatId: chat.groupChatId,
								role: 'MEMBER'
							}
						})
					)
				)
			})

			return { message: 'Enrolled successfully.' }
		}),

	// ---------------------------------------------------------------------------
	// READ
	// ---------------------------------------------------------------------------
	//

	// Find Course by Token
	findOneCourse: protectedProcedure
		.input(findOneCourseSchema)
		.query(async ({ ctx, input: { token } }) => {
			if (!ctx.session.user.id) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'You must be logged in to enroll in a course'
				})
			}

			const course = await ctx.db.course.findUnique({
				where: { token },
				include: {
					instructor: { select: { profile: { select: { name: true } } } },
					tags: true
				}
			})

			if (!course) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Course not found'
				})
			}

			return {
				course: {
					courseId: course.courseId,
					code: course.code,
					title: course.title,
					description: course.description,
					imageUrl: course.imageUrl,
					token: course.token,
					instructorName: course.instructor.profile?.name,
					tags: course.tags
				}
			}
		})
})
