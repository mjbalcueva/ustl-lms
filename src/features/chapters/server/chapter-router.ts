import { TRPCClientError } from '@trpc/client'

import {
	createTRPCRouter,
	instructorProcedure,
	protectedProcedure
} from '@/server/api/trpc'

import { muxVideo } from '@/services/mux/video'
import { utapi } from '@/services/uploadthing/utapi'

import { catchError } from '@/core/lib/utils/catch-error'

import {
	addChapterAssessmentSchema,
	editChapterAssessmentOrderSchema
} from '@/features/chapters/validations/chapter-assessments-schema'
import {
	addChapterAttachmentSchema,
	deleteChapterAttachmentSchema
} from '@/features/chapters/validations/chapter-attachments-schema'
import { editChapterContentSchema } from '@/features/chapters/validations/chapter-content-schema'
import {
	deleteChapterSchema,
	findChapterSchema,
	toggleChapterCompletionSchema
} from '@/features/chapters/validations/chapter-schema'
import { editChapterStatusSchema } from '@/features/chapters/validations/chapter-status-schema'
import { getChapterSubmissionSchema } from '@/features/chapters/validations/chapter-submission-schema'
import { editChapterTitleSchema } from '@/features/chapters/validations/chapter-title-schema'
import { editChapterTypeSchema } from '@/features/chapters/validations/chapter-type-schema'
import { editChapterVideoSchema } from '@/features/chapters/validations/chapter-video-schema'

export const chapterRouter = createTRPCRouter({
	// Student
	//
	getSubmission: protectedProcedure
		.input(getChapterSubmissionSchema)
		.query(async ({ ctx, input }) => {
			const submission = await ctx.db.attachment.findFirst({
				where: {
					chapterId: input.chapterId,
					courseId: input.courseId,
					submissionId: input.submissionId
				}
			})

			return submission
		}),

	// submitAssignment: protectedProcedure
	// 	.input(submitChapterAssignmentSchema)
	// 	.mutation(async ({ ctx, input }) => {
	// 		const { chapterId, submissionUrl, fileName } = input

	// 		const chapter = await ctx.db.chapter.findUnique({
	// 			where: { id: chapterId },
	// 			include: {
	// 				course: {
	// 					select: {
	// 						id: true,
	// 						enrollments: {
	// 							where: { userId: ctx.session.user.id }
	// 						}
	// 					}
	// 				}
	// 			}
	// 		})

	// 		if (!chapter) {
	// 			throw new TRPCClientError('Chapter not found')
	// 		}

	// 		if (chapter.course.enrollments.length === 0) {
	// 			throw new TRPCClientError('You must be enrolled in this course to submit assignments')
	// 		}

	// 		if (chapter.type !== 'ASSIGNMENT') {
	// 			throw new TRPCClientError('This chapter does not accept submissions')
	// 		}

	// 		const existingSubmission = await ctx.db.attachment.findFirst({
	// 			where: {
	// 				chapterId,
	// 				submissionId
	// 			}
	// 		})

	// 		if (existingSubmission) {
	// 			// Delete old submission file
	// 			const oldSubmissionKey = existingSubmission.url.split('/f/')[1]
	// 			if (oldSubmissionKey) await utapi.deleteFiles(oldSubmissionKey)

	// 			await ctx.db.attachment.update({
	// 				where: { id: existingSubmission.id },
	// 				data: {
	// 					url: submissionUrl,
	// 					name: fileName,
	// 					updatedAt: new Date()
	// 				}
	// 			})

	// 			return { message: 'Assignment resubmitted successfully' }
	// 		}

	// 		await ctx.db.attachment.create({
	// 			data: {
	// 				courseId: chapter.course.id,
	// 				chapterId,
	// 				studentId: ctx.session.user.id,
	// 				url: submissionUrl,
	// 				name: fileName,
	// 				type: 'SUBMISSION'
	// 			}
	// 		})

	// 		return { message: 'Assignment submitted successfully' }
	// 	}),

	toggleChapterCompletion: protectedProcedure
		.input(toggleChapterCompletionSchema)
		.mutation(async ({ ctx, input }) => {
			const { chapterId } = input

			const existingProgress = await ctx.db.chapterProgress.findFirst({
				where: {
					user: { id: ctx.session.user.id },
					chapterId
				}
			})

			if (existingProgress) {
				const updatedProgress = await ctx.db.chapterProgress.update({
					where: { id: existingProgress.id },
					data: { isCompleted: !existingProgress.isCompleted }
				})

				return {
					message: updatedProgress.isCompleted
						? 'Chapter marked as completed'
						: 'Chapter marked as incomplete',
					isCompleted: updatedProgress.isCompleted
				}
			}

			const newProgress = await ctx.db.chapterProgress.create({
				data: {
					user: { connect: { id: ctx.session.user.id } },
					chapter: { connect: { id: chapterId } },
					isCompleted: true
				}
			})

			return {
				message: 'Chapter marked as completed',
				isCompleted: newProgress.isCompleted
			}
		})
})
