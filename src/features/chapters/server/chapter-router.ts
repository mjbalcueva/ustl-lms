import { TRPCClientError } from '@trpc/client'

import { createTRPCRouter, instructorProcedure, protectedProcedure } from '@/server/api/trpc'

import { muxVideo } from '@/services/mux/video'
import { utapi } from '@/services/uploadthing/utapi'

import { catchError } from '@/core/lib/utils/catch-error'

import {
	addChapterAttachmentSchema,
	deleteChapterAttachmentSchema
} from '@/features/chapters/validations/chapter-attachments-schema'
import { editChapterContentSchema } from '@/features/chapters/validations/chapter-content-schema'
import {
	deleteChapterSchema,
	findChapterSchema
} from '@/features/chapters/validations/chapter-schema'
import { editChapterStatusSchema } from '@/features/chapters/validations/chapter-status-schema'
import { editChapterTitleSchema } from '@/features/chapters/validations/chapter-title-schema'
import { editChapterTypeSchema } from '@/features/chapters/validations/chapter-type-schema'
import { editChapterVideoSchema } from '@/features/chapters/validations/chapter-video-schema'

export const chapterRouter = createTRPCRouter({
	// Instructor
	//
	findChapter: protectedProcedure.input(findChapterSchema).query(async ({ ctx, input }) => {
		const { id, courseId } = input

		const chapter = await ctx.db.chapter.findUnique({
			where: { id, courseId },
			include: { attachments: true, course: true, muxData: true }
		})

		return { chapter }
	}),

	deleteChapter: instructorProcedure.input(deleteChapterSchema).mutation(async ({ ctx, input }) => {
		const { id } = input

		// delete the chapter video from mux
		const chapter = await ctx.db.chapter.findUnique({
			where: { id, course: { instructorId: ctx.session.user.id } },
			select: { videoUrl: true }
		})

		const oldVideoKey = chapter?.videoUrl?.split('/f/')[1]
		if (oldVideoKey) await utapi.deleteFiles(oldVideoKey)

		const existingMuxData = await ctx.db.muxData.findFirst({
			where: { chapterId: id }
		})

		if (existingMuxData) {
			await muxVideo.assets.delete(existingMuxData.assetId)
			await ctx.db.muxData.delete({
				where: { id: existingMuxData.id }
			})
		}

		// delete all the chapter attachments in uploadthing
		const attachments = await ctx.db.attachment.findMany({
			where: { chapterId: id }
		})

		for (const attachment of attachments) {
			const attachmentKey = attachment.url.split('/f/')[1]
			if (attachmentKey) await utapi.deleteFiles(attachmentKey)
		}

		// delete the chapter
		await ctx.db.chapter.delete({
			where: { id, course: { instructorId: ctx.session.user.id } }
		})

		return { message: 'Chapter deleted successfully' }
	}),

	editTitle: instructorProcedure.input(editChapterTitleSchema).mutation(async ({ ctx, input }) => {
		const { id, courseId, title } = input

		const { title: newTitle } = await ctx.db.chapter.update({
			where: { id, courseId, course: { instructorId: ctx.session.user.id } },
			data: { title }
		})

		return {
			message: 'Chapter title updated successfully',
			newTitle
		}
	}),

	editContent: instructorProcedure
		.input(editChapterContentSchema)
		.mutation(async ({ ctx, input }) => {
			const { id, courseId, content } = input

			const { content: newContent } = await ctx.db.chapter.update({
				where: { id, courseId, course: { instructorId: ctx.session.user.id } },
				data: { content }
			})

			return {
				message: 'Chapter content updated successfully',
				newContent
			}
		}),

	editVideo: instructorProcedure.input(editChapterVideoSchema).mutation(async ({ ctx, input }) => {
		const { id, courseId, videoUrl } = input

		const chapter = await ctx.db.chapter.findUnique({
			where: { id, courseId, course: { instructorId: ctx.session.user.id } },
			select: { videoUrl: true }
		})

		const oldVideoKey = chapter?.videoUrl?.split('/f/')[1]
		if (oldVideoKey) await utapi.deleteFiles(oldVideoKey)

		const updatedChapter = await ctx.db.chapter.update({
			where: { id, courseId, course: { instructorId: ctx.session.user.id } },
			data: { videoUrl }
		})

		const existingMuxData = await ctx.db.muxData.findFirst({
			where: { chapterId: id }
		})

		if (existingMuxData) {
			await muxVideo.assets.delete(existingMuxData.assetId)
			await ctx.db.muxData.delete({
				where: { id: existingMuxData.id }
			})
		}

		const asset = await muxVideo.assets.create({
			input: [{ url: videoUrl ?? '' }],
			playback_policy: ['public'],
			test: false
		})

		await ctx.db.muxData.create({
			data: {
				chapterId: id,
				assetId: asset.id,
				playbackId: asset.playback_ids?.[0]?.id ?? ''
			}
		})

		return { message: 'Chapter video updated successfully', chapter: updatedChapter }
	}),

	editType: instructorProcedure.input(editChapterTypeSchema).mutation(async ({ ctx, input }) => {
		const { id, courseId, type } = input

		const { type: newType } = await ctx.db.chapter.update({
			where: { id, courseId, course: { instructorId: ctx.session.user.id } },
			data: { type }
		})

		return { message: 'Chapter type updated successfully', newType }
	}),

	editStatus: instructorProcedure
		.input(editChapterStatusSchema)
		.mutation(async ({ ctx, input }) => {
			const { id, courseId, status } = input

			const [data, error] = await catchError(
				ctx.db.chapter.updateMany({
					where: { id, courseId, course: { instructorId: ctx.session.user.id } },
					data: { status }
				})
			)

			if (error) {
				throw error
			}

			if (data?.count === 0) {
				throw new TRPCClientError('Chapter not found or you are not authorized to update it.')
			}

			const statusMessages: Record<string, string> = {
				PUBLISHED: 'Chapter published successfully',
				DRAFT: 'Chapter saved as draft',
				ARCHIVED: 'Chapter archived successfully'
			}

			const message = statusMessages[status] ?? 'Chapter status updated successfully'

			return { message }
		}),

	addChapterAttachment: instructorProcedure
		.input(addChapterAttachmentSchema)
		.mutation(async ({ ctx, input }) => {
			const { courseId, chapterId, url, name } = input

			const chapterOwner = await ctx.db.chapter.findUnique({
				where: { id: chapterId, course: { instructorId: ctx.session.user.id } }
			})
			if (!chapterOwner) throw new Error('Chapter not found')

			await ctx.db.attachment.create({
				data: { courseId, chapterId, url, name }
			})

			return { message: 'Chapter attachment created!' }
		}),

	deleteAttachment: instructorProcedure
		.input(deleteChapterAttachmentSchema)
		.mutation(async ({ ctx, input }) => {
			const { attachmentId } = input

			const attachment = await ctx.db.attachment.delete({
				where: { id: attachmentId, chapter: { course: { instructorId: ctx.session.user.id } } }
			})

			const attachmentKey = attachment?.url.split('/f/')[1]
			if (attachmentKey) await utapi.deleteFiles(attachmentKey)

			return { message: 'Chapter attachment deleted!', attachment }
		})
})
