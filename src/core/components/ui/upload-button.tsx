import { UploadButton as UTUploadButton } from '@uploadthing/react'
import { toast } from 'sonner'

// eslint-disable-next-line boundaries/element-types
import { type OurFileRouter } from '@/services/uploadthing/core'

type FileUploadProps = {
	onChange: (url?: string, name?: string) => void
	endpoint: keyof OurFileRouter
}

export const UploadButton = ({ onChange, endpoint }: FileUploadProps) => (
	<UTUploadButton<OurFileRouter, typeof endpoint>
		endpoint={endpoint}
		onClientUploadComplete={(res) => {
			onChange(res[0]?.url, res[0]?.name)
		}}
		onUploadError={(error: Error) => {
			toast.error(`ERROR! ${error.message}`)
		}}
		onUploadBegin={(name) => {
			toast.info(`Uploading: ${name}`)
		}}
	/>
)
