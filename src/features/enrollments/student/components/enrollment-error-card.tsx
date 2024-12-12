import Link from 'next/link'

import { buttonVariants } from '@/core/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/core/components/ui/card'
import { FormResponse } from '@/core/components/ui/form-response'
import { cn } from '@/core/lib/utils/cn'

type EnrollmentErrorCardProps = {
	title: string
	description: string
	message: string
}

export const EnrollmentErrorCard = ({
	title,
	description,
	message
}: EnrollmentErrorCardProps) => (
	<Card className="w-full max-w-md">
		<CardHeader className="flex flex-col items-start py-6">
			<CardTitle className="text-2xl">{title}</CardTitle>
			<CardDescription>{description}</CardDescription>
		</CardHeader>
		<CardContent className="pb-6">
			<FormResponse type="error" message={message} />
		</CardContent>
		<CardFooter>
			<Link
				href="/courses"
				className={cn(buttonVariants({ variant: 'link', size: 'link' }))}
			>
				Go to courses
			</Link>
		</CardFooter>
	</Card>
)
