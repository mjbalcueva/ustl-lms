'use client'

// import { useRouter } from 'next/navigation'
// import { useState } from 'react'
// import { toast } from 'sonner'

// import { api } from '@/services/trpc/react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/core/components/ui/card'
import { Separator } from '@/core/components/ui/separator'
import { Upload } from '@/core/lib/icons'

type AssignmentSubmissionProps = {
	chapterId: string
}

export const AssignmentSubmission = ({}: AssignmentSubmissionProps) => {
	// const router = useRouter()
	// const [, setIsSubmitting] = useState(false)

	// const { data: submission, isLoading } = api.chapter.getSubmission.useQuery(
	// 	{ chapterId },
	// 	{
	// 		refetchOnWindowFocus: false
	// 	}
	// )

	// const { mutate: submitAssignment } = api.chapter.submitAssignment.useMutation({
	// 	onSuccess: (data) => {
	// 		setIsSubmitting(false)
	// 		router.refresh()
	// 		toast.success(data.message)
	// 	},
	// 	onError: (error) => {
	// 		setIsSubmitting(false)
	// 		toast.error(error.message)
	// 	}
	// })

	// const handleSubmission = (url?: string, name?: string) => {
	// 	if (!url || !name) return

	// 	setIsSubmitting(true)
	// 	// submitAssignment({
	// 	// 	chapterId,
	// 	// 	submissionUrl: url,
	// 	// 	fileName: name
	// 	// })
	// }

	// const handleDownload = async (url: string) => {
	// 	try {
	// 		window.open(url, '_blank', 'noopener,noreferrer')
	// 	} catch (error) {
	// 		toast.error(
	// 			`Error downloading file: ${error instanceof Error ? error.message : 'Unknown error'}`
	// 		)
	// 	}
	// }

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Upload className="size-5" />
					Submit Assignment
				</CardTitle>
			</CardHeader>

			<Separator />

			<CardContent className="space-y-4 pt-6">
				{/* {submission && (
					<div
						className="flex cursor-pointer items-center justify-between rounded-lg p-4 hover:bg-muted/50"
						onClick={() => handleDownload(submission.url)}
					>
						<Tooltip>
							<TooltipTrigger className="flex flex-1 items-center gap-4" tabIndex={-1}>
								<Attachment className="h-4 w-4 shrink-0" />
								<div className="text-start">
									<p className="line-clamp-1 text-sm font-medium leading-none">
										{removeExtension(submission.name)}
									</p>
									<p className="text-xs text-muted-foreground">
										Submitted: {formatDate(submission.createdAt)}
									</p>
								</div>
							</TooltipTrigger>
							<TooltipContent>{submission.name}</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger className="flex size-8 shrink-0 items-center justify-center rounded-lg ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring">
								<Download className="size-4" />
							</TooltipTrigger>
							<TooltipContent>Download</TooltipContent>
						</Tooltip>
					</div>
				)} */}

				{/* <FileUpload endpoint="assignmentUpload" onChange={handleSubmission} /> */}
			</CardContent>

			<CardFooter className="text-sm text-muted-foreground">
				{/* {submission
					? 'You can resubmit your assignment by uploading a new file. The previous submission will be replaced.'
					: 'Upload your completed assignment file. Supported formats: PDF, DOC, DOCX, and other common file types.'} */}
			</CardFooter>
		</Card>
	)
}
