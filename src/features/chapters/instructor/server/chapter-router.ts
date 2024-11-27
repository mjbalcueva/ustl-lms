import { TRPCClientError } from '@trpc/client'

import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

import { muxVideo } from '@/services/mux/video'
import { utapi } from '@/services/uploadthing/utapi'

import {
	deleteChapterSchema,
	editChapterStatusSchema,
	editChapterTypeSchema,
	findOneChapterSchema
} from '@/features/chapters/shared/validations/chapter-schema'

export const chapterRouter = createTRPCRouter({
	// ---------------------------------------------------------------------------
	// CREATE
	// ---------------------------------------------------------------------------
	//
	// ---------------------------------------------------------------------------
	// READ
	// ---------------------------------------------------------------------------
	//

	// Find One Chapter
	findOneChapter: instructorProcedure
		.input(findOneChapterSchema)
		.query(async ({ ctx, input }) => {
			const { chapterId } = input
			const instructorId = ctx.session.user.id

			const chapter = await ctx.db.chapter.findUnique({
				where: { chapterId, course: { instructorId } },
				include: {
					course: { select: { title: true } },
					attachments: { orderBy: { createdAt: 'desc' } }
				}
			})

			if (!chapter) throw new TRPCClientError('Chapter not found')

			return { chapter }
		}),

	// ---------------------------------------------------------------------------
	// UPDATE
	// ---------------------------------------------------------------------------
	//

	// Edit Chapter Type
	editType: instructorProcedure
		.input(editChapterTypeSchema)
		.mutation(async ({ ctx, input }) => {
			const { chapterId, type } = input
			const instructorId = ctx.session.user.id

			const updatedChapter = await ctx.db.chapter.update({
				where: { chapterId, course: { instructorId } },
				data: { type }
			})

			return { message: 'Chapter type updated successfully', updatedChapter }
		}),

	// Edit Chapter Status
	editStatus: instructorProcedure
		.input(editChapterStatusSchema)
		.mutation(async ({ ctx, input }) => {
			const { chapterId, status } = input
			const instructorId = ctx.session.user.id

			const updatedChapter = await ctx.db.chapter.update({
				where: { chapterId, course: { instructorId } },
				data: { status }
			})

			return { message: 'Chapter status updated successfully', updatedChapter }
		}),

	// ---------------------------------------------------------------------------
	// DELETE
	// ---------------------------------------------------------------------------
	//

	// Delete Chapter
	deleteChapter: instructorProcedure
		.input(deleteChapterSchema)
		.mutation(async ({ ctx, input }) => {
			const { chapterId } = input
			const instructorId = ctx.session.user.id

			// Find chapter and verify ownership
			const chapter = await ctx.db.chapter.findUnique({
				where: { chapterId, course: { instructorId } }
			})
			if (!chapter) throw new TRPCClientError('Chapter not found')

			// Delete Mux video data
			const muxData = await ctx.db.chapterMuxData.findFirst({
				where: { chapterId }
			})
			if (muxData) {
				await muxVideo.assets.delete(muxData.assetId)
				await ctx.db.chapterMuxData.delete({
					where: { muxId: muxData.muxId }
				})
			}

			// Delete attachment files
			const attachments = await ctx.db.chapterAttachment.findMany({
				where: { chapterId }
			})
			await Promise.all(
				attachments
					.map((a) => a.url.split('/f/')[1])
					.filter((key): key is string => !!key)
					.map((key) => utapi.deleteFiles(key))
			)

			// Delete chapter and cascade related records
			await ctx.db.chapter.delete({ where: { chapterId } })

			return { message: 'Chapter deleted successfully' }
		})
})
