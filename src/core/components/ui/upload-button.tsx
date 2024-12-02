import { toast } from 'sonner'

// eslint-disable-next-line boundaries/element-types
import { type OurFileRouter } from '@/services/uploadthing/core'
// eslint-disable-next-line boundaries/element-types
import { UploadButton as UTUploadButton } from '@/services/uploadthing/uploadthing'

import { Upload } from '@/core/lib/icons'
import { cn } from '@/core/lib/utils/cn'

import { buttonVariants } from './button'

type FileUploadProps = {
	onChange: (url?: string, name?: string) => void
	endpoint: keyof OurFileRouter
	variant?:
		| 'default'
		| 'destructive'
		| 'outline'
		| 'secondary'
		| 'ghost'
		| 'link'
		| 'shine'
	size?: 'default' | 'xs' | 'sm' | 'md' | 'lg' | 'icon' | 'link'
	className?: string
}

export const UploadButton = ({
	onChange,
	endpoint,
	variant = 'default',
	size = 'default',
	className
}: FileUploadProps) => (
	<UTUploadButton
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
		appearance={{
			button: ({ ready: _, isUploading }) =>
				cn(
					buttonVariants({ variant, size }),
					isUploading && 'opacity-50 cursor-not-allowed',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
					className
				),
			container:
				'w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
			allowedContent: 'hidden'
		}}
		content={{
			button({ ready, isUploading }) {
				if (isUploading) return 'Uploading...'
				if (!ready) return 'Getting ready...'
				return (
					<>
						<Upload className="size-4" />
						Upload file
					</>
				)
			}
		}}
	/>
)
