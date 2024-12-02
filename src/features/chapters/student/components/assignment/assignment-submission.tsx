'use client'

import { Button } from '@/core/components/ui/button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/core/components/ui/card'
import { Separator } from '@/core/components/ui/separator'

export const AssignmentSubmission = () => {
	return (
		<Card>
			<CardHeader className="py-3">
				<CardTitle className="text-lg">Your Submission</CardTitle>
			</CardHeader>

			<Separator />

			<CardContent className="space-y-4 pt-6"></CardContent>

			<CardFooter>
				<Button type="submit" size="sm">
					Save
				</Button>
			</CardFooter>
		</Card>
	)
}
