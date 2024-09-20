import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'

import { api } from '@/shared/trpc/server'

const f = createUploadthing()

const handleAuth = async () => {
	const session = await api.session.getSession()
	if (!session) throw new UploadThingError('Unauthorized')

	return { userId: session.user.id }
}

const handleUpload = async ({ metadata }: { metadata: { userId: string | undefined } }) => ({
	uploadedBy: metadata.userId
})

export const ourFileRouter = {
	imageUpload: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
		.middleware(() => handleAuth())
		.onUploadComplete(({ metadata }) => handleUpload({ metadata })),

	videoUpload: f({ video: { maxFileSize: '4GB', maxFileCount: 1 } })
		.middleware(() => handleAuth())
		.onUploadComplete(({ metadata }) => handleUpload({ metadata })),

	attachmentUpload: f(['text', 'image', 'video', 'audio', 'pdf'])
		.middleware(() => handleAuth())
		.onUploadComplete(({ metadata }) => handleUpload({ metadata }))
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
