import { toast } from 'sonner'

// eslint-disable-next-line boundaries/element-types
import { type OurFileRouter } from '@/services/uploadthing/core'
// eslint-disable-next-line boundaries/element-types
import { UploadDropzone } from '@/services/uploadthing/uploadthing'

type FileUploadProps = {
	onChange: (url?: string, name?: string) => void
	endpoint: keyof OurFileRouter
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => (
	<UploadDropzone
		endpoint={endpoint}
		onClientUploadComplete={(res) => {
			onChange(res[0]?.url, res[0]?.name)
		}}
		onUploadError={(error: Error) => {
			toast.error(`ERROR! ${error?.message}`)
		}}
		onUploadBegin={(name) => {
			toast.info(`Uploading: ${name}`)
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
