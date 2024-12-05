import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

import { findOneEnrolledCourseSchema } from '@/features/courses/shared/validations/course-schema'

export const courseRouter = createTRPCRouter({
	// ---------------------------------------------------------------------------
	// READ
	// ---------------------------------------------------------------------------
	//

	// Find One Enrolled Course
	findEnrolledCourse: protectedProcedure
		.input(findOneEnrolledCourseSchema)
		.query(async ({ ctx, input: { courseId } }) => {
			const studentId = ctx.session.user.id

			const course = await ctx.db.course.findUnique({
				where: {
					courseId,
					enrollments: { some: { studentId } }
				},
				include: {
					tags: { orderBy: { name: 'asc' } },
					attachments: true,
					chapters: {
						include: { chapterProgress: { where: { studentId } } },
						where: { status: 'PUBLISHED' },
						orderBy: { position: 'asc' }
					},
					_count: { select: { chapters: true } },
					instructor: {
						select: {
							profile: { select: { name: true, bio: true, imageUrl: true } },
							email: true
						}
					}
				}
			})

			const completedCount = course?.chapters.filter(
				(chapter) => chapter.chapterProgress[0]?.isCompleted
			).length

			return {
				course: {
					...course,
					progress:
						course?._count.chapters && course?._count.chapters > 0
							? ((completedCount ?? 0) / course._count.chapters) * 100
							: 0
				}
			}
		}),

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
			},
			orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }]
		})

		return { courses }
	})
})
