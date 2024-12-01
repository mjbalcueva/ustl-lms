'use client'

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/core/components/ui/card'
import { Separator } from '@/core/components/ui/separator'
import { Upload } from '@/core/lib/icons'

export const AssignmentSubmission = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Upload className="size-5" />
					Submit Assignment
				</CardTitle>
			</CardHeader>

			<Separator />

			<CardContent className="space-y-4 pt-6"></CardContent>

			<CardFooter className="text-sm text-muted-foreground">
				Submit footer
			</CardFooter>
		</Card>
	)
}
