import Link from 'next/link'

import { FormResponse } from '@/client/components/auth/form-response'
import { buttonVariants } from '@/client/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/client/components/ui/card'
import { cn } from '@/client/lib/utils'

type EnrollmentErrorCardProps = {
	title: string
	description: string
	message: string
}

export const EnrollmentErrorCard = ({ title, description, message }: EnrollmentErrorCardProps) => (
	<Card className="w-full max-w-md">
		<CardHeader className="flex flex-col items-start py-6">
			<CardTitle className="text-2xl">{title}</CardTitle>
			<CardDescription>{description}</CardDescription>
		</CardHeader>
		<CardContent className="pb-6">
			<FormResponse type="error" message={message} />
		</CardContent>
		<CardFooter>
			<Link href="/dashboard" className={cn(buttonVariants({ variant: 'link', size: 'link' }))}>
				Go to dashboard
			</Link>
		</CardFooter>
	</Card>
)
