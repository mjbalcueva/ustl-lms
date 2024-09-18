import { UploadDropzone } from '@uploadthing/react'
import { toast } from 'sonner'

import { type OurFileRouter } from '@/app/api/uploadthing/core'

type FileUploadProps = {
	onChange: (url?: string | undefined) => void
	endpoint: keyof OurFileRouter
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => (
	<UploadDropzone<OurFileRouter, typeof endpoint>
		endpoint={endpoint}
		onClientUploadComplete={(res) => {
			onChange(res[0]?.url)
		}}
		onUploadError={(error: Error) => {
			toast.error(`ERROR! ${error?.message}`)
		}}
		className="bg-card p-4 dark:bg-background"
	/>
)
