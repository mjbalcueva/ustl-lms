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
		className="outline-none"
		appearance={{
			allowedContent: 'text-muted-foreground',
			button: 'h-8 bg-primary px-3 text-sm !text-primary-foreground',
			container:
				'!mt-0 rounded-xl border-2 border-dashed border-input bg-card p-4 outline-none ring-ring ring-offset-2 ring-offset-background focus:ring-2 dark:bg-background',
			uploadIcon: 'text-muted-foreground'
		}}
	/>
)
