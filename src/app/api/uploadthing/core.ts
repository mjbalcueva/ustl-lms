import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'

import { auth } from '@/server/lib/auth'

const f = createUploadthing()

const handleAuth = async () => {
	const session = await auth()
	if (!session) throw new UploadThingError('Unauthorized')

	return { userId: session.user.id }
}

type handleUploadProps = {
	metadata: { userId: string | undefined }
	file: { url: string }
	uploadType: string
}

const handleUpload = async ({ metadata, file, uploadType }: handleUploadProps) => {
	console.log(`Upload complete for ${uploadType}:`, {
		userId: metadata.userId,
		fileUrl: file.url
	})
	return { uploadedBy: metadata.userId }
}

export const ourFileRouter = {
	imageUpload: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
		.middleware(() => handleAuth())
		.onUploadComplete(({ metadata, file }) => handleUpload({ metadata, file, uploadType: 'imageUpload' })),

	videoUpload: f({ video: { maxFileSize: '4GB', maxFileCount: 1 } })
		.middleware(() => handleAuth())
		.onUploadComplete(({ metadata, file }) => handleUpload({ metadata, file, uploadType: 'videoUpload' })),

	attachmentUpload: f(['text', 'image', 'video', 'audio', 'pdf'])
		.middleware(() => handleAuth())
		.onUploadComplete(({ metadata, file }) => handleUpload({ metadata, file, uploadType: 'attachmentUpload' }))
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
