'use client'

import { Button } from '@/core/components/ui/button'
import { Upload } from '@/core/lib/icons'

interface UploadButtonProps {
	onChange: (files: File[]) => void
	disabled?: boolean
}

export const UploadButton = ({ onChange, disabled }: UploadButtonProps) => {
	return (
		<div className="flex items-center gap-4">
			<input
				type="file"
				id="file-upload"
				className="hidden"
				accept="image/*,.pdf"
				multiple
				onChange={(e) => {
					const files = Array.from(e.target.files ?? [])
					onChange(files)
				}}
			/>
			<Button
				type="button"
				variant="outline"
				className="bg-card !text-card-foreground dark:bg-background"
				disabled={disabled}
				onClick={() => {
					document.getElementById('file-upload')?.click()
				}}
			>
				<Upload className="size-4" />
				Upload File
			</Button>
		</div>
	)
}
